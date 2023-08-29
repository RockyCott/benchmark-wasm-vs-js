use gloo_utils::format::JsValueSerdeExt;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct Position {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

#[derive(Serialize, Deserialize)]
pub struct Intermediario {
    pub positions: Vec<Position>,
}

#[wasm_bindgen]
pub fn collision_detection(positions: JsValue, radiuses: &[f64], res: &mut [u8], n: usize) -> i32 {
    let positions: Intermediario = positions.into_serde().unwrap();
    let positions: Vec<Position> = positions.positions;

    let mut count = 0;

    for i in 0..n {
        let p = &positions[i];
        let r = radiuses[i];
        let mut collision = 0;

        for j in (i + 1)..n {
            let p2 = &positions[j];
            let r2 = radiuses[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let dz = p.z - p2.z;

            // Optimización: calcula el cuadrado de la distancia en lugar de la distancia real
            let squared_distance = dx * dx + dy * dy + dz * dz;

            // Optimización: compara el cuadrado de la distancia con el cuadrado del radio
            if r * r > squared_distance {
                collision = 1;
                count += 1;
                break;
            }
        }

        let index = i / 8;
        let pos = 7 - (i % 8);

        if collision == 0 {
            res[index] &= !(1 << pos);
        } else {
            res[index] |= 1 << pos;
        }
    }
    count
}
