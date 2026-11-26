class Node {
  final Node? left;
  final Node? right;
  Node(this.left, this.right);
}

Node make(int d) => d == 0 ? Node(null, null) : Node(make(d - 1), make(d - 1));

int check(Node n) {
  final l = n.left, r = n.right;
  return l != null && r != null ? 1 + check(l) + check(r) : 1;
}

void main() {
  const maxDepth = 18;
  final longLived = make(maxDepth);
  var total = 0;
  for (var d = 4; d <= maxDepth; d += 2) {
    final iterations = 1 << (maxDepth - d + 4);
    for (var i = 0; i < iterations; i++) {
      total += check(make(d));
    }
  }
  print(total + check(longLived));
}
