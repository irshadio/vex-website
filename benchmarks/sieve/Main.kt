fun main() {
    val limit = 20_000_000
    val isPrime = BooleanArray(limit) { it >= 2 }
    var count = 0
    for (n in 2 until limit) {
        if (isPrime[n]) {
            count++
            var m = n.toLong() * n
            while (m < limit) {
                isPrime[m.toInt()] = false
                m += n
            }
        }
    }
    println(count)
}
