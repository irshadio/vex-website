---
title: "Primes"
description: "Sieve of Eratosthenes over a million numbers."
---

Sieve of Eratosthenes over a million numbers.

```vex title="primes.vx"
/// Returns the primes below [limit] with the Sieve of Eratosthenes.
fn primes(limit: int) -> [int] {
    var isPrime: [bool] = []
    for i in 0..limit {
        isPrime.push(i >= 2)
    }
    var found: [int] = []
    for n in 2..limit {
        if isPrime[n] {
            found.push(n)
            var m = n * n
            while m < limit {
                isPrime[m] = false
                m += n
            }
        }
    }
    return found
}

fn main() {
    let small = primes(50)
    println("Primes below 50: {small}")
    println("There are {primes(1000000).len} primes below one million")
}
```

Run it with:

```sh
vex run primes.vx
```

Output:

```text
Primes below 50: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
There are 78498 primes below one million
```
