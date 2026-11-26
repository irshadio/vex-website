---
title: "Input"
description: "Reading from the keyboard with input()."
---

Reading from the keyboard with `input()`.

[Open in the playground](/playground?example=input)

```vex title="input.vx"
// Reads a name and numbers from the keyboard, until an empty line.

fn main() {
    let name = input("What's your name? ")
    println("Hi, {name}! Enter numbers, one per line. Leave a line empty to finish.")

    var numbers: [float] = []
    while true {
        let line = input("> ")
        if line == "" {
            break
        }
        numbers.push(float(line))
    }

    if numbers.len == 0 {
        println("No numbers entered.")
        return
    }
    var total = 0.0
    for n in numbers {
        total += n
    }
    println("{name}, you entered {numbers.len} numbers.")
    println("Sum: {total}, average: {total / float(numbers.len)}")
}
```

Run it with:

```sh
vex run input.vx
```

Input:

```text
Ann
4
8.5
-2
```

Output:

```text
What's your name? Hi, Ann! Enter numbers, one per line. Leave a line empty to finish.
> > > > Ann, you entered 3 numbers.
Sum: 10.5, average: 3.5
```
