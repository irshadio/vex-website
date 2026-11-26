fn main() {
    let limit: usize = 20_000_000;
    let mut is_prime: Vec<bool> = (0..limit).map(|i| i >= 2).collect();
    let mut count = 0;
    for n in 2..limit {
        if is_prime[n] {
            count += 1;
            let mut m = n * n;
            while m < limit {
                is_prime[m] = false;
                m += n;
            }
        }
    }
    println!("{}", count);
}
