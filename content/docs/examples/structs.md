---
title: "Structs"
description: "Fields with defaults, methods, static fn, shared references."
---

Fields with defaults, methods, `static fn`, shared references.

[Open in the playground](/playground?example=structs)

```vex title="structs.vx"
/// A bank account with a running history.
struct Account {
    owner: string
    balance: float = 0.0
    history: [string] = []

    fn deposit(amount: float) {
        balance += amount
        history.push("+{amount}")
    }

    fn withdraw(amount: float) -> bool {
        if amount > balance {
            history.push("declined {amount}")
            return false
        }
        balance -= amount
        history.push("-{amount}")
        return true
    }

    fn summary() -> string => "{owner}: {balance}"

    static fn opening(owner: string) -> Account {
        let account = Account(owner: owner)
        account.deposit(10.0)
        return account
    }
}

fn main() {
    let ann = Account.opening("Ann")
    ann.deposit(50.5)
    ann.withdraw(20)
    if !ann.withdraw(500) {
        println("Not enough money for that")
    }
    println(ann.summary())
    println("History: {ann.history}")

    // Structs are shared: both names refer to the same account.
    let same = ann
    same.deposit(1)
    println(ann.summary())
    println(ann)
}
```

Run it with:

```sh
vex run structs.vx
```

Output:

```text
Not enough money for that
Ann: 40.5
History: ["+10.0", "+50.5", "-20.0", "declined 500.0"]
Ann: 41.5
Account(owner: "Ann", balance: 41.5, history: ["+10.0", "+50.5", "-20.0", "declined 500.0", "+1.0"])
```
