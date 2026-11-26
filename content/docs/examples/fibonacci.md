---
title: "Fibonacci"
description: "Recursion and building a list."
---

Recursion and building a list.

```vex title="fibonacci.vx"
/// Returns the nth Fibonacci number, recursively.
fn fib(n: int) -> int {
    if n < 2 {
        return n
    }
    return fib(n - 1) + fib(n - 2)
}

/// Returns the first [count] Fibonacci numbers, with a loop.
fn sequence(count: int) -> [int] {
    var result: [int] = []
    var a = 0
    var b = 1
    for i in 0..count {
        result.push(a)
        let next = a + b
        a = b
        b = next
    }
    return result
}

fn main() {
    println("First 15: {sequence(15)}")
    println("fib(30) = {fib(30)}")
}
```

Run it with:

```sh
vex run fibonacci.vx
```

Output:

```text
First 15: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]
fib(30) = 832040
```
