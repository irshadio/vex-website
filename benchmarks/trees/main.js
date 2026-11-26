class Node {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
}
const make = (d) => (d === 0 ? new Node(null, null) : new Node(make(d - 1), make(d - 1)));
const check = (n) => (n.left === null ? 1 : 1 + check(n.left) + check(n.right));
const maxDepth = 18;
const longLived = make(maxDepth);
let total = 0;
for (let d = 4; d <= maxDepth; d += 2) {
  const iterations = 1 << (maxDepth - d + 4);
  for (let i = 0; i < iterations; i++) total += check(make(d));
}
console.log(total + check(longLived));
