use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn multiply_int_vector(src1: &[i32], src2: &[i32], res: &mut [i32], n: usize) {
    for i in 0..n {
        res[i] = src1[i] * src2[i];
    }
}
