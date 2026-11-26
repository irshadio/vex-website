---
title: "Maps"
description: "Counts words, groups them by length and keeps a small inventory."
---

Counts words, groups them by length and keeps a small inventory.

[Open in the playground](/playground?example=maps)

```vex title="maps.vx"
// Counts words, groups them by length and keeps a small inventory.

enum Size { small, large }

fn wordCounts(text: string) -> [string: int] {
    var counts: [string: int] = [:]
    for word in text.lower().split(" ") {
        if word != "" {
            counts[word] = (counts[word] ?? 0) + 1
        }
    }
    return counts
}

fn main() {
    let counts = wordCounts("the cat and the hat and the bat")
    println(counts)
    println("the: {counts["the"] ?? 0}, dog: {counts["dog"] ?? 0}")

    var byLength: [int: [string]] = [:]
    for word, n in counts {
        var group = byLength[word.len] ?? []
        group.push(word)
        byLength[word.len] = group
    }
    for length, words in byLength {
        println("{length} letters: {words}")
    }

    var stock = ["apples": 5, "pears": 0, "plums": 12]
    stock["figs"] = 3
    if let gone = stock.remove("pears") {
        println("removed pears ({gone} left)")
    }
    var total = 0
    for item, n in stock {
        total += n
    }
    println(stock.keys, total)

    let sizes: [Size: string] = [.small: "S", .large: "L"]
    println(sizes[.large] ?? "?", sizes.contains(.small))
}
```

Run it with:

```sh
vex run maps.vx
```

Output:

```text
["the": 3, "cat": 1, "and": 2, "hat": 1, "bat": 1]
the: 3, dog: 0
3 letters: ["the", "cat", "and", "hat", "bat"]
removed pears (0 left)
["apples", "plums", "figs"] 20
L true
```
