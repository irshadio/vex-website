final class Node {
    let left: Node?
    let right: Node?
    init(_ left: Node?, _ right: Node?) { self.left = left; self.right = right }
}

func make(_ d: Int) -> Node { d == 0 ? Node(nil, nil) : Node(make(d - 1), make(d - 1)) }

func check(_ n: Node) -> Int {
    if let l = n.left, let r = n.right { return 1 + check(l) + check(r) }
    return 1
}

let maxDepth = 18
let longLived = make(maxDepth)
var total = 0
for d in stride(from: 4, through: maxDepth, by: 2) {
    let iterations = 1 << (maxDepth - d + 4)
    for _ in 0..<iterations { total += check(make(d)) }
}
print(total + check(longLived))
