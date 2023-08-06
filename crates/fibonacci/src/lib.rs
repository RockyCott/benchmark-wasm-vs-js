use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: usize) -> usize {
    if n <= 0 {
        return 0;
    }

    let mut fib = vec![0, 1];

    for i in 2..=n as usize {
        let next_fib = fib[i - 1] + fib[i - 2];
        fib.push(next_fib);
    }

    return fib[n as usize];
}

// test fibonacci

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn test_fibonacci() {
//         assert_eq!(fibonacci(0), 0);
//         assert_eq!(fibonacci(1), 1);
//         assert_eq!(fibonacci(2), 1);
//         assert_eq!(fibonacci(3), 2);
//         assert_eq!(fibonacci(4), 3);
//         assert_eq!(fibonacci(5), 5);
//         assert_eq!(fibonacci(6), 8);
//         assert_eq!(fibonacci(7), 13);
//         assert_eq!(fibonacci(8), 21);
//         assert_eq!(fibonacci(9), 34);
//         assert_eq!(fibonacci(10), 55);
//     }
// }
