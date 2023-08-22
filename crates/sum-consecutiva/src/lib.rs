use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn sum_consecutiva(n: u64) -> u64 {
    let sum = (1+n)*n/2;
    sum
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Instant;

    #[test]
    fn test_sum_consecutiva() {
        let start_time = Instant::now();
        assert_eq!(sum_consecutiva(1), 1);
        println!("Time taken for n=1: {:?}", start_time.elapsed());

        let start_time = Instant::now();
        assert_eq!(sum_consecutiva(10), 55);
        println!("Time taken for n=10: {:?}", start_time.elapsed());

        let start_time = Instant::now();
        assert_eq!(sum_consecutiva(100), 5050);
        println!("Time taken for n=100: {:?}", start_time.elapsed());

        let start_time = Instant::now();
        assert_eq!(sum_consecutiva(1000), 500500);
        println!("Time taken for n=1000: {:?}", start_time.elapsed());

        let start_time = Instant::now();
        assert_eq!(sum_consecutiva(10000), 50005000);
        println!("Time taken for n=10000: {:?}", start_time.elapsed());

        let start_time = Instant::now();
        assert_eq!(sum_consecutiva(100000), 5000050000);
        println!("Time taken for n=100000: {:?}", start_time.elapsed());

        let start_time = Instant::now();
        assert_eq!(sum_consecutiva(1000000), 500000500000);
        println!("Time taken for n=1000000: {:?}", start_time.elapsed());
    }
}