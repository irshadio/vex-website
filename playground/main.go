// Command playground exposes the Vex compiler front end to the browser as
// WebAssembly, so programs are checked without a server.
package main

import (
	"errors"
	"fmt"
	"strings"
	"syscall/js"
	"testing/fstest"

	"github.com/irshadio/vex-lang/compiler/diag"
	"github.com/irshadio/vex-lang/compiler/modules"
	"github.com/irshadio/vex-lang/compiler/types"
)

// The compiler version, set at build time with -ldflags "-X main.version=...".
var version = "dev"

const fileName = "main.vx"

// Checks [src] as a single-file program. Returns the diagnostics as the
// command line prints them.
func check(src string) (ok bool, messages string) {
	var out strings.Builder
	fsys := fstest.MapFS{fileName: {Data: []byte(src)}}
	prog, err := modules.LoadFS(fsys, fileName, fileName, false)
	if prog != nil {
		for _, d := range prog.Warnings() {
			out.WriteString(diag.Format(nil, d, false) + "\n")
		}
	}
	if err == nil {
		if _, err = types.CheckProgram(prog); err == nil {
			return true, out.String()
		}
	}
	var list diag.List
	if !errors.As(err, &list) {
		fmt.Fprintf(&out, "vex: %v\n", err)
		return false, out.String()
	}
	list.Sort()
	for i, d := range list {
		if i > 0 {
			out.WriteString("\n")
		}
		out.WriteString(diag.Format(nil, d, false))
	}
	if len(list) > 1 {
		fmt.Fprintf(&out, "\n%d errors\n", len(list))
	}
	return false, out.String()
}

func main() {
	js.Global().Set("vex", js.ValueOf(map[string]any{
		"version": version,
		"check": js.FuncOf(func(_ js.Value, args []js.Value) any {
			ok, msg := check(args[0].String())
			return map[string]any{"ok": ok, "messages": msg}
		}),
	}))
	select {}
}
