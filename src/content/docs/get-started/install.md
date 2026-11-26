---
title: Install
description: Build the Vex compiler and run your first program.
---

## Requirements
- Go 1.23 or newer, to build the compiler
- A C compiler (`clang` or `gcc`), to build Vex programs

## Build from source

```sh
git clone https://github.com/irshadio/vex-lang.git
cd vex-lang
./build.sh
```

This builds `bin/vex`. To run `vex` from anywhere, add the folder to your `PATH` (for zsh):

```sh
echo 'export PATH="'"$PWD"'/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Usage

```sh
vex check hello.vx          # check for errors without building
vex run hello.vx            # compile and run
vex build hello.vx -o hello # build a standalone native binary
vex emit-c hello.vx         # print the generated C
vex run                     # run the project in this folder (with a package.toml)
vex run app.vx one two      # arguments after the program go to it (os.args())
vex version
```

## Hello, world

```swift
fn main() {
    println("Hello, world!")
}
```

Save it as `hello.vx` and run `vex run hello.vx`.

## Examples

The [examples](https://github.com/irshadio/vex-lang/tree/main/examples) folder has small complete programs, each with its expected output:

| Example | Shows |
|---|---|
| [hello.vx](https://github.com/irshadio/vex-lang/blob/main/examples/hello.vx) | The smallest program |
| [fizzbuzz.vx](https://github.com/irshadio/vex-lang/blob/main/examples/fizzbuzz.vx) | `if`/`else if`, ranges |
| [fibonacci.vx](https://github.com/irshadio/vex-lang/blob/main/examples/fibonacci.vx) | Recursion and building a list |
| [primes.vx](https://github.com/irshadio/vex-lang/blob/main/examples/primes.vx) | Sieve of Eratosthenes over a million numbers |
| [sorting.vx](https://github.com/irshadio/vex-lang/blob/main/examples/sorting.vx) | Bubble sort and insertion sort, in place |
| [structs.vx](https://github.com/irshadio/vex-lang/blob/main/examples/structs.vx) | Fields with defaults, methods, `static fn`, shared references |
| [closures.vx](https://github.com/irshadio/vex-lang/blob/main/examples/closures.vx) | Closures, trailing blocks, functions returning functions, `filter` and `map` |
| [enums.vx](https://github.com/irshadio/vex-lang/blob/main/examples/enums.vx) | Enums with values, methods, `match` and `.case` shorthand |
| [optionals.vx](https://github.com/irshadio/vex-lang/blob/main/examples/optionals.vx) | `T?`, `nil`, `if let`, `guard let`, `?.` and `??` |
| [errors.vx](https://github.com/irshadio/vex-lang/blob/main/examples/errors.vx) | `throws`, `throw`, `try`, `catch`, `try?` and typed errors |
| [input.vx](https://github.com/irshadio/vex-lang/blob/main/examples/input.vx) | Reading from the keyboard with `input()` |

```sh
vex run examples/primes.vx
```

