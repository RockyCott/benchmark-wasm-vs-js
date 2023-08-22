use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn multiply_double(a: f64, b: f64, n: i32) -> f64 {
    let ab: f64 = a * b;
    ab.powi(n)
}
