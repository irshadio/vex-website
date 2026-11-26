let limit = 20_000_000
var isPrime = [Bool](repeating: true, count: limit)
isPrime[0] = false
isPrime[1] = false
var count = 0
for n in 2..<limit where isPrime[n] {
    count += 1
    var m = n * n
    while m < limit {
        isPrime[m] = false
        m += n
    }
}
print(count)
