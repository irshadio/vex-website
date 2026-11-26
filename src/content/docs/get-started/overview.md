---
title: Overview
description: What Vex is and how it works.
---

Vex is a programming language for writing iOS and Android apps with one codebase and real native widgets.

:::caution[Early development]
Vex is at v0.1. The core language compiles to native binaries and runs on macOS and Linux. Mobile UI is the next step and is not ready for production use.
:::

## How it works

```
main.vx ─► Lexer ─► Parser ─► Type checker ─► C code ─► clang ─► native binary
```

The compiler is written in Go. It turns Vex source into portable C, then uses the system C compiler to produce a native executable. Because the output is C, the same pipeline can target macOS, iOS and Android.

Memory is managed by a garbage collector built into the runtime.
