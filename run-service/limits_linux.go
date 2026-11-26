package main

import "syscall"

// The process-count limit, which the syscall package doesn't name.
const rlimitNproc = 6

// Limits memory through the address space, which Linux enforces.
const rlimitMemory = syscall.RLIMIT_AS
