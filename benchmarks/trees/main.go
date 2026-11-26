package main

import "fmt"

type Node struct{ left, right *Node }

func make_(d int) *Node {
	if d == 0 {
		return &Node{}
	}
	return &Node{make_(d - 1), make_(d - 1)}
}

func check(n *Node) int {
	if n.left == nil {
		return 1
	}
	return 1 + check(n.left) + check(n.right)
}

func main() {
	const maxDepth = 18
	longLived := make_(maxDepth)
	total := 0
	for d := 4; d <= maxDepth; d += 2 {
		iterations := 1 << (maxDepth - d + 4)
		for i := 0; i < iterations; i++ {
			total += check(make_(d))
		}
	}
	fmt.Println(total + check(longLived))
}
