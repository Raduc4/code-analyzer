fn find_max(numbers: &Vec<i32>) -> i32 {
    let mut max = 0;
    for &n in numbers {
        if n > max {
            max = n;
        }
    }
    max
}

// Do you see any problem here?
