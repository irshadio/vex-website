package main

// The process-count limit, which the syscall package doesn't name.
const rlimitNproc = 7

// macOS refuses memory limits, so local runs go without one; the service
// is deployed on Linux, where it applies.
const rlimitMemory = -1
