---
title: "Optionals"
description: "T?, nil, if let, guard let, ?. and ??."
---

`T?`, `nil`, `if let`, `guard let`, `?.` and `??`.

[Open in the playground](/playground?example=optionals)

```vex title="optionals.vx"
/// A person in a small company.
struct Person {
    name: string
    manager: Person? = nil
    email: string? = nil

    fn contact() -> string => email ?? "no email"
}

/// Returns the person called [name], or nil.
fn find(people: [Person], name: string) -> Person? {
    for p in people {
        if p.name == name {
            return p
        }
    }
    return nil
}

/// Returns the number in [text], or nil when it isn't one.
fn parseAge(text: string) -> int? {
    if text == "" || text.contains(" ") {
        return nil
    }
    return int(text)
}

fn introduce(people: [Person], name: string) {
    guard let p = find(people, name) else {
        println("{name}: not found")
        return
    }
    let boss = p.manager?.name ?? "nobody"
    println("{p.name} reports to {boss}, {p.contact()}")
}

fn main() {
    let ceo = Person(name: "Maya", email: "maya@example.com")
    let lead = Person(name: "Omar", manager: ceo)
    let dev = Person(name: "Lena", manager: lead, email: "lena@example.com")
    let people = [ceo, lead, dev]

    for name in ["Lena", "Omar", "Maya", "Zed"] {
        introduce(people, name)
    }

    // Chains stop at the first nil.
    println(dev.manager?.manager?.name, ceo.manager?.manager?.name)

    if let boss = find(people, "Lena")?.manager {
        println("Lena's manager is {boss.name}")
    }

    var total = 0
    for text in ["31", "", "4 2", "27"] {
        let age = parseAge(text)
        println("'{text}' ->", age)
        total += age ?? 0
    }
    println("total:", total)

    var selected: Person? = nil
    println(selected == nil)
    selected = dev
    println(selected?.name ?? "none")
}
```

Run it with:

```sh
vex run optionals.vx
```

Output:

```text
Lena reports to Omar, lena@example.com
Omar reports to Maya, no email
Maya reports to nobody, maya@example.com
Zed: not found
Maya nil
Lena's manager is Omar
'31' -> 31
'' -> nil
'4 2' -> nil
'27' -> 27
total: 58
true
Lena
```
