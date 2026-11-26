// Command run-service compiles and runs playground programs in a sandbox,
// answering with the terminal session: what the program printed, and the
// input lines typed at its prompts.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/irshadio/vex-lang/compiler/diag"
	"github.com/irshadio/vex-lang/compiler/lexer"
)

// Limits on what a request may send and what a program may use.
const (
	maxSourceBytes      = 64 << 10
	maxInputLines       = 200
	maxLineBytes        = 1000
	maxOutputBytes      = 64 << 10
	compileTimeout      = 30 * time.Second
	runTimeout          = 10 * time.Second
	cpuSeconds          = 5
	fileBytes           = 1 << 20
	openFiles           = 64
	quietBeforeTyping   = 150 * time.Millisecond
	waitForSilentPrompt = 1500 * time.Millisecond
)

// Imports the playground refuses, because they reach the machine running it.
var blockedImports = map[string]bool{"vex:os": true, "vex:fs": true}

// The request body: the program, and the lines to type at its prompts.
type runRequest struct {
	Source string   `json:"source"`
	Input  []string `json:"input"`
}

// One step of the session: printed output, error output, or a typed line.
type event map[string]string

// The response body.
type runResponse struct {
	Session  []event `json:"session"`
	ExitCode int     `json:"exitCode"`
}

// The service's settings, read from the environment.
type config struct {
	vex       string
	memoryMB  uint64
	processes int
	// How long a program that hasn't printed anything yet gets to start
	// before the first input line is typed.
	startWait time.Duration
	origins   map[string]bool
	anyOrigin bool
	slots     chan struct{}
}

func main() {
	if len(os.Args) > 1 && os.Args[1] == "limit" {
		execLimited(os.Args[2:])
		return
	}
	cfg := config{
		vex:      env("VEX", "vex"),
		memoryMB: uint64(envInt("MEMORY_MB", 256)),
		// Counted per user across every program running at once, threads included.
		processes: envInt("PROCESSES", 256),
		startWait: time.Duration(envInt("START_WAIT_MS", 3000)) * time.Millisecond,
		origins:   map[string]bool{},
		slots:     make(chan struct{}, envInt("MAX_CONCURRENT", 4)),
	}
	for _, o := range strings.Split(env("ALLOWED_ORIGINS", "*"), ",") {
		if o = strings.TrimSpace(o); o == "*" {
			cfg.anyOrigin = true
		} else if o != "" {
			cfg.origins[o] = true
		}
	}
	limiter := newLimiter(envInt("RUNS_PER_MINUTE", 30))
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) { io.WriteString(w, "ok\n") })
	mux.HandleFunc("/run", func(w http.ResponseWriter, r *http.Request) { cfg.serveRun(w, r, limiter) })
	addr := ":" + env("PORT", "8080")
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}

func (cfg *config) serveRun(w http.ResponseWriter, r *http.Request, limiter *limiter) {
	if origin := r.Header.Get("Origin"); origin != "" && (cfg.anyOrigin || cfg.origins[origin]) {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Vary", "Origin")
	}
	switch r.Method {
	case http.MethodOptions:
		return
	case http.MethodPost:
	default:
		http.Error(w, "use POST", http.StatusMethodNotAllowed)
		return
	}
	if !limiter.allow(clientIP(r)) {
		http.Error(w, "too many runs; try again in a minute", http.StatusTooManyRequests)
		return
	}
	var req runRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 2*maxSourceBytes)).Decode(&req); err != nil {
		http.Error(w, "the body must be JSON with source and input", http.StatusBadRequest)
		return
	}
	if msg := validate(req); msg != "" {
		http.Error(w, msg, http.StatusBadRequest)
		return
	}
	select {
	case cfg.slots <- struct{}{}:
		defer func() { <-cfg.slots }()
	case <-time.After(10 * time.Second):
		http.Error(w, "the playground is busy; try again", http.StatusServiceUnavailable)
		return
	}
	res := cfg.run(r.Context(), req)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

// Returns why [req] can't be accepted, or an empty string.
func validate(req runRequest) string {
	if len(req.Source) > maxSourceBytes {
		return fmt.Sprintf("the program is longer than %d KB", maxSourceBytes>>10)
	}
	if len(req.Input) > maxInputLines {
		return fmt.Sprintf("more than %d input lines", maxInputLines)
	}
	for _, l := range req.Input {
		if len(l) > maxLineBytes || strings.ContainsAny(l, "\n\r") {
			return "an input line is too long or contains a line break"
		}
	}
	return ""
}

// Returns a compiler-style error when [src] uses something the playground
// refuses, or an empty string.
func refused(src string) string {
	toks, err := lexer.Tokenize(diag.NewFile("main.vx", src))
	if err != nil {
		return ""
	}
	for i, t := range toks {
		switch {
		case t.Kind == lexer.Extern:
			return fmt.Sprintf("error: C functions (extern fn) aren't available in the playground\n --> main.vx:%v\n", t.Pos)
		case t.Kind == lexer.Import && i+1 < len(toks) && toks[i+1].Kind == lexer.String && blockedImports[toks[i+1].Value]:
			return fmt.Sprintf("error: %s isn't available in the playground; run the program with vex run on your machine\n --> main.vx:%v\n", toks[i+1].Value, toks[i+1].Pos)
		}
	}
	return ""
}

// Compiles and runs [req], returning its session.
func (cfg *config) run(ctx context.Context, req runRequest) runResponse {
	if msg := refused(req.Source); msg != "" {
		return runResponse{Session: []event{{"err": msg}}, ExitCode: 1}
	}
	dir, err := os.MkdirTemp("", "run-")
	if err != nil {
		return failure("couldn't prepare the program: " + err.Error())
	}
	defer os.RemoveAll(dir)
	if err := os.WriteFile(filepath.Join(dir, "main.vx"), []byte(req.Source), 0o644); err != nil {
		return failure("couldn't prepare the program: " + err.Error())
	}

	cctx, cancel := context.WithTimeout(ctx, compileTimeout)
	defer cancel()
	build := exec.CommandContext(cctx, cfg.vex, "build", "main.vx", "-o", "main")
	build.Dir = dir
	build.Env = []string{"PATH=" + os.Getenv("PATH"), "HOME=" + dir, "NO_COLOR=1"}
	if out, err := build.CombinedOutput(); err != nil {
		if cctx.Err() != nil {
			return failure("compiling took too long")
		}
		return runResponse{Session: []event{{"err": string(out)}}, ExitCode: 1}
	}
	return cfg.session(ctx, dir, req.Input)
}

func failure(msg string) runResponse {
	return runResponse{Session: []event{{"err": msg + "\n"}}, ExitCode: 1}
}

// A piece of output read from the program.
type chunk struct {
	kind string
	data string
}

// Runs the built program in [dir] under limits, typing each of [lines] once
// it has printed its prompt and gone quiet, and records the session.
func (cfg *config) session(ctx context.Context, dir string, lines []string) runResponse {
	self, err := os.Executable()
	if err != nil {
		return failure(err.Error())
	}
	cmd := exec.Command(self, "limit", strconv.Itoa(cpuSeconds), strconv.FormatUint(cfg.memoryMB<<20, 10),
		strconv.Itoa(fileBytes), strconv.Itoa(openFiles), strconv.Itoa(cfg.processes), "./main")
	cmd.Dir = dir
	cmd.Env = []string{"PATH=/usr/bin:/bin", "HOME=" + dir}
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if os.Getuid() == 0 {
		// Programs run as nobody, so they can't touch the service's files.
		cmd.SysProcAttr.Credential = &syscall.Credential{Uid: 65534, Gid: 65534}
		os.Chown(dir, 65534, 65534)
	}
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return failure(err.Error())
	}
	outR, outW, _ := os.Pipe()
	errR, errW, _ := os.Pipe()
	cmd.Stdout, cmd.Stderr = outW, errW
	if err := cmd.Start(); err != nil {
		return failure(err.Error())
	}
	outW.Close()
	errW.Close()

	chunks := make(chan chunk)
	var readers sync.WaitGroup
	for kind, r := range map[string]*os.File{"out": outR, "err": errR} {
		readers.Add(1)
		go func() {
			defer readers.Done()
			buf := make([]byte, 4096)
			for {
				n, err := r.Read(buf)
				if n > 0 {
					chunks <- chunk{kind, string(buf[:n])}
				}
				if err != nil {
					return
				}
			}
		}()
	}
	go func() {
		readers.Wait()
		close(chunks)
	}()

	kill := func() { syscall.Kill(-cmd.Process.Pid, syscall.SIGKILL) }
	var events []event
	add := func(kind, data string) {
		if n := len(events); n > 0 && events[n-1][kind] != "" && len(events[n-1]) == 1 {
			events[n-1][kind] += data
		} else {
			events = append(events, event{kind: data})
		}
	}
	pending := lines
	stdinOpen := true
	typing := time.NewTimer(cfg.startWait)
	deadline := time.NewTimer(runTimeout)
	defer typing.Stop()
	defer deadline.Stop()
	total, stopped := 0, ""

loop:
	for {
		select {
		case c, ok := <-chunks:
			if !ok {
				break loop
			}
			if stopped != "" {
				continue
			}
			if room := maxOutputBytes - total; len(c.data) > room {
				add(c.kind, c.data[:room])
				stopped = fmt.Sprintf("stopped: the program printed more than %d KB", maxOutputBytes>>10)
				kill()
				continue
			}
			total += len(c.data)
			add(c.kind, c.data)
			typing.Reset(quietBeforeTyping)
		case <-typing.C:
			if len(pending) > 0 {
				events = append(events, event{"in": pending[0]})
				io.WriteString(stdin, pending[0]+"\n")
				pending = pending[1:]
				typing.Reset(waitForSilentPrompt)
			} else if stdinOpen {
				stdin.Close()
				stdinOpen = false
			}
		case <-deadline.C:
			if stopped == "" {
				stopped = fmt.Sprintf("stopped: the program ran for more than %d seconds", int(runTimeout.Seconds()))
			}
			kill()
		case <-ctx.Done():
			kill()
		}
	}
	if stdinOpen {
		stdin.Close()
	}
	err = cmd.Wait()
	code := 0
	var exit *exec.ExitError
	if errors.As(err, &exit) {
		code = exit.ExitCode()
		if ws, ok := exit.Sys().(syscall.WaitStatus); ok && ws.Signaled() {
			code = 128 + int(ws.Signal())
			if ws.Signal() == syscall.SIGXCPU && stopped == "" {
				stopped = fmt.Sprintf("stopped: the program used more than %d seconds of CPU time", cpuSeconds)
			}
		}
	}
	if stopped != "" {
		add("err", "\n"+stopped+"\n")
	}
	if events == nil {
		events = []event{}
	}
	return runResponse{Session: events, ExitCode: code}
}

// Sets resource limits for this process and replaces it with the program.
// Called as: limit <cpu seconds> <memory bytes> <file bytes> <open files> <processes> <program>.
func execLimited(args []string) {
	if len(args) != 6 {
		os.Exit(2)
	}
	n := make([]uint64, 5)
	for i := range n {
		v, err := strconv.ParseUint(args[i], 10, 64)
		if err != nil {
			os.Exit(2)
		}
		n[i] = v
	}
	limits := []struct {
		res int
		max uint64
	}{
		{syscall.RLIMIT_CPU, n[0]},
		{rlimitMemory, n[1]},
		{syscall.RLIMIT_FSIZE, n[2]},
		{syscall.RLIMIT_NOFILE, n[3]},
		{rlimitNproc, n[4]},
		{syscall.RLIMIT_CORE, 0},
	}
	for _, l := range limits {
		if l.res < 0 {
			continue
		}
		// A limit can only be lowered, so it never asks for more than the current maximum.
		var cur syscall.Rlimit
		if err := syscall.Getrlimit(l.res, &cur); err == nil && cur.Max < l.max {
			l.max = cur.Max
		}
		lim := syscall.Rlimit{Cur: l.max, Max: l.max}
		if err := syscall.Setrlimit(l.res, &lim); err != nil {
			fmt.Fprintf(os.Stderr, "couldn't limit the program: %v\n", err)
			os.Exit(1)
		}
	}
	err := syscall.Exec(args[5], []string{args[5]}, os.Environ())
	fmt.Fprintf(os.Stderr, "couldn't start the program: %v\n", err)
	os.Exit(1)
}

// Counts runs per client over the last minute.
type limiter struct {
	mu    sync.Mutex
	max   int
	times map[string][]time.Time
}

func newLimiter(max int) *limiter {
	return &limiter{max: max, times: map[string][]time.Time{}}
}

// Reports whether [ip] may run another program now, and counts it.
func (l *limiter) allow(ip string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := time.Now()
	recent := l.times[ip][:0]
	for _, t := range l.times[ip] {
		if now.Sub(t) < time.Minute {
			recent = append(recent, t)
		}
	}
	if len(recent) >= l.max {
		l.times[ip] = recent
		return false
	}
	l.times[ip] = append(recent, now)
	return true
}

// Returns the client's address, using the first forwarded address behind a proxy.
func clientIP(r *http.Request) string {
	if f := r.Header.Get("X-Forwarded-For"); f != "" {
		return strings.TrimSpace(strings.Split(f, ",")[0])
	}
	host, _, _ := net.SplitHostPort(r.RemoteAddr)
	return host
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func envInt(key string, fallback int) int {
	if v, err := strconv.Atoi(os.Getenv(key)); err == nil && v > 0 {
		return v
	}
	return fallback
}
