use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn multiply_double_vector(src1: &[f64], src2: &[f64], res: &mut [f64], n: usize) {
    for i in 0..n {
        res[i] = src1[i] * src2[i];
    }
}