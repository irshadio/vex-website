class Node(val left: Node?, val right: Node?)

fun make(d: Int): Node = if (d == 0) Node(null, null) else Node(make(d - 1), make(d - 1))

fun check(n: Node): Long {
    val l = n.left
    val r = n.right
    return if (l != null && r != null) 1 + check(l) + check(r) else 1
}

fun main() {
    val maxDepth = 18
    val longLived = make(maxDepth)
    var total = 0L
    for (d in 4..maxDepth step 2) {
        val iterations = 1 shl (maxDepth - d + 4)
        repeat(iterations) { total += check(make(d)) }
    }
    println(total + check(longLived))
}
