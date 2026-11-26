---
title: "Fizzbuzz"
description: "if/else if, ranges."
---

`if`/`else if`, ranges.

[Open in the playground](/playground?example=fizzbuzz)

```vex title="fizzbuzz.vx"
fn fizzbuzz(n: int) -> string {
    if n % 15 == 0 {
        return "FizzBuzz"
    } else if n % 3 == 0 {
        return "Fizz"
    } else if n % 5 == 0 {
        return "Buzz"
    }
    return str(n)
}

fn main() {
    for i in 1..=20 {
        println(fizzbuzz(i))
    }
}
```

Run it with:

```sh
vex run fizzbuzz.vx
```

Output:

```text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz
```
