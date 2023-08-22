// cargar modulo rust wasm
import * as wasm from "./rust/pkg/math_operations.js";

async function rust_load() {
  await wasm.default();
  const boton = document.getElementById("operationButton");
  boton.addEventListener("click", operacion);
}

rust_load();

function operacion() {
  let num1 = document.getElementById("num1").value;
  let num2 = document.getElementById("num2").value;
  let operacion = document.getElementById("operacion").value;
  let lenguaje = document.getElementById("lenguaje").value;
  let resultado = 0;
  if (lenguaje === null) {
    return;
  }
  switch (operacion) {
    case "suma":
      resultado = add_operation(num1, num2, lenguaje);
      break;
    case "resta":
      resultado = subtract_operation(num1, num2, lenguaje);
      break;
    case "multiplicacion":
      resultado = multiply_operation(num1, num2, lenguaje);
      break;
    case "division":
      resultado = divide_operation(num1, num2, lenguaje);
      break;
  }
  document.getElementById("resultado").innerHTML = resultado;
}

function add_operation(num1, num2, lenguaje) {
  if (lenguaje === "javascript") {
    return parseInt(num1) + parseInt(num2);
  } else if (lenguaje === "rust") {
    return wasm.add(parseInt(num1), parseInt(num2));
  }
}

function subtract_operation(num1, num2, lenguaje) {
  if (lenguaje === "javascript") {
    return parseInt(num1) - parseInt(num2);
  } else if (lenguaje === "rust") {
    return wasm.subtract(parseInt(num1), parseInt(num2));
  }
}

function multiply_operation(num1, num2, lenguaje) {
  if (lenguaje === "javascript") {
    return parseInt(num1) * parseInt(num2);
  } else if (lenguaje === "rust") {
    return wasm.multiply(parseInt(num1), parseInt(num2));
  }
}

function divide_operation(num1, num2, lenguaje) {
  if (lenguaje === "javascript") {
    return parseInt(num1) / parseInt(num2);
  } else if (lenguaje === "rust") {
    return wasm.divide(parseInt(num1), parseInt(num2));
  }
}
