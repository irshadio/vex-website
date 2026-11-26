package main

import "fmt"

func main() {
	const limit = 20000000
	isPrime := make([]bool, limit)
	for i := range isPrime {
		isPrime[i] = i >= 2
	}
	count := 0
	for n := 2; n < limit; n++ {
		if isPrime[n] {
			count++
			for m := n * n; m < limit; m += n {
				isPrime[m] = false
			}
		}
	}
	fmt.Println(count)
}
