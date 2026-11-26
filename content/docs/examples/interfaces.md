---
title: "Interfaces"
description: "Structs promise methods, and code works with any struct that keeps the promise."
---

Structs promise methods, and code works with any struct that keeps the promise.

[Open in the playground](/playground?example=interfaces)

```vex title="interfaces.vx"
// Interfaces: structs promise methods, and code works with any struct that
// keeps the promise.

interface Shape {
    fn area() -> float
    fn name() -> string => "shape"

    // Defaults can call the other methods, which use each struct's own.
    fn summary() -> string => "{name()}: {area()}"
}

interface Resizable {
    fn resize(by: float)
}

struct Circle: Shape, Resizable {
    radius: float

    fn area() -> float => 3.14 * radius * radius
    fn name() -> string => "circle"
    fn resize(by: float) {
        radius = radius * by
    }
}

struct Rect: Shape, Resizable {
    width: float
    height: float

    fn area() -> float => width * height
    fn resize(by: float) {
        width = width * by
        height = height * by
    }
}

fn totalArea(shapes: [Shape]) -> float {
    var total = 0.0
    for s in shapes {
        total += s.area()
    }
    return total
}

// A generic constrained by an interface is compiled for each type, so the
// calls inside go straight to that type's methods.
fn largest<T: Shape>(items: [T]) -> T? {
    if items.len == 0 {
        return nil
    }
    var best = items[0]
    for item in items {
        if item.area() > best.area() {
            best = item
        }
    }
    return best
}

fn main() {
    let c = Circle(radius: 1.0)
    let r = Rect(width: 2.0, height: 3.0)
    let shapes: [Shape] = [c, r]
    for s in shapes {
        println(s.summary())
    }
    println("total:", totalArea(shapes))

    let resizable: [Resizable] = [c, r]
    for x in resizable {
        x.resize(by: 2.0)
    }
    println(shapes)

    println(largest([Rect(width: 1.0, height: 1.0), Rect(width: 5.0, height: 2.0)]))
    if let big = largest(shapes) {
        println("largest:", big.name())
    }
}
```

Run it with:

```sh
vex run interfaces.vx
```

Output:

```text
circle: 3.14
shape: 6.0
total: 9.14
[Circle(radius: 2.0), Rect(width: 4.0, height: 6.0)]
Rect(width: 5.0, height: 2.0)
largest: shape
```
