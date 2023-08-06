use wasm_bindgen::prelude::*;


#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn warn(s: &str);
}

#[wasm_bindgen]
pub fn add(a: usize, b: usize) -> usize {
    log("Add from Rust!");
    a + b
}

#[wasm_bindgen]
pub fn subtract(a: usize, b: usize) -> usize {
    log("Substract from Rust!");
    a - b
}

#[wasm_bindgen]
pub fn multiply(a: usize, b: usize) -> usize {
    log("Multiply from Rust!");
    a * b
}

#[wasm_bindgen]
pub fn divide(a: usize, b: usize) -> usize {
    log("Didide from Rust!");
    if b == 0 {
        panic!("Division by zero")
    } else {
        a / b
    }
}
