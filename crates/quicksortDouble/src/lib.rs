use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn quicksort_double(slice: &mut [f64], start: usize, end: usize) {
    if start < end {
        let partition_index = partition(slice, start, end);

        if partition_index > 0 {
            quicksort_double(slice, start, partition_index - 1);
        }

        quicksort_double(slice, partition_index + 1, end);
    }
}

fn partition(slice: &mut [f64], start: usize, end: usize) -> usize {
    let pivot = slice[end];
    let mut i = start;

    for j in start..end {
        if slice[j] < pivot {
            slice.swap(i, j);
            i += 1;
        }
    }

    slice.swap(i, end);

    i
}