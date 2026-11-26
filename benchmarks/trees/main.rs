struct Node {
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn make(d: u32) -> Box<Node> {
    if d == 0 {
        Box::new(Node { left: None, right: None })
    } else {
        Box::new(Node { left: Some(make(d - 1)), right: Some(make(d - 1)) })
    }
}

fn check(n: &Node) -> i64 {
    match (&n.left, &n.right) {
        (Some(l), Some(r)) => 1 + check(l) + check(r),
        _ => 1,
    }
}

fn main() {
    let max_depth = 18;
    let long_lived = make(max_depth);
    let mut total = 0;
    let mut d = 4;
    while d <= max_depth {
        let iterations = 1i64 << (max_depth - d + 4);
        for _ in 0..iterations {
            total += check(&make(d));
        }
        d += 2;
    }
    println!("{}", total + check(&long_lived));
}
