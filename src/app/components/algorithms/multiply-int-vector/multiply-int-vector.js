import * as rust_wasm from "./libs/rust2/multiplyIntVecRust.js";
let rust_load = false;
let cpp_load = false;

function ngInit() {
  const boton = document.getElementById("run_button");
  boton.addEventListener("click", start);
}

async function rustLoad() {
  await rust_wasm.default();
  rust_load = true;
  // await wasm.default();
  console.log("rust loaded");
  onReady();
}

rustLoad();

// esperar a que cargue el body
document.addEventListener("DOMContentLoaded", ngInit);

function jsMultiplyIntVec(src1, src2, res, n) {
  for (let i = 0; i < n; i++) {
    res[i] = src1[i] * src2[i];
  }
}

// fibonacci escrito en rust

let module,
  functions = {};
fetch("libs/cpp/multiplyIntVec.wasm")
  .then((response) => response.arrayBuffer())
  .then((buffer) => new Uint8Array(buffer))
  .then((binary) => {
    let moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: function() {
        functions.multiplyIntVec = module.cwrap("multiplyIntVec", null, [
          "number",
          "number",
          "number",
        ]);
        cpp_load = true;
        console.log("cpp loaded");
        onReady();
      },
    };
    module = Module(moduleArgs);
  });

function start() {
  // obtener el valor del input
  let num = document.getElementById("stacked-number").value;
  // convertir a numero
  num = Number(num);
  let loop = document.getElementById("stacked-loops").value;
  loop = Number(loop);
  if (num === 0 || loop === 0) {
    document.getElementById("message").innerText =
      "Please input both number and loop";
    document.getElementById("run_button").disabled = false;
  } else if (num > 0 && loop > 0) {
    document.getElementById("run_button").disabled = true;
    let jsPerformance = document.getElementById("js_performance");
    let cwsPerformance = document.getElementById("c_ws_performance");
    let rustwsPerformance = document.getElementById("rust_ws_performance");

    let cwsComparison = document.getElementById("c_ws_comparison");
    let rustwsComparison = document.getElementById("rust_ws_comparison");

    jsPerformance.innerText = "";
    cwsPerformance.innerText = "";
    rustwsPerformance.innerText = "";

    cwsComparison.innerText = "";
    rustwsComparison.innerText = "";

    let src1 = new Int32Array(num);
    let src2 = new Int32Array(num);
    let src3 = new Int32Array(num);

    let res1 = new Int32Array(num); // for JavaScript
    let res2 = new Int32Array(num); // for Cpp WebAssembly
    let res3 = new Int32Array(num); // for Rust WebAssembly

    initArray(src1);
    initArray(src2);
    initArray(src3);

    function initArray(array) {
      for (let i = 0, il = array.length; i < il; i++) {
        array[i] = ((Math.random() * 20000) | 0) - 10000;
      }
    }

    function equalArray(array1, array2) {
      if (array1.length !== array2.length) return false;
      for (let i = 0, il = array1.length; i < il; i++) {
        if (array1[i] !== array2[i]) return false;
      }
      return true;
    }

    function checkFunctionality() {
      jsMultiplyIntVec(src1, src2, res1, src1.length);
      cppwsMultiplyIntVec(src1, src2, res2, src1.length);
      rustwsMultiplyIntVec(src1, src2, res3);
      const jsCppResult = equalArray(res1, res2);
      const jsRustResult = equalArray(res1, res3);
      return jsCppResult && jsRustResult;
    }

    function run(func, src1, src2, res, loop) {
      func(src1, src2, res, src1.length);
      let elapsedTime = 0.0;
      for (let i = 0; i < loop; i++) {
        let startTime = performance.now();
        func(src1, src2, res, src1.length);
        let endTime = performance.now();
        elapsedTime += endTime - startTime;
      }
      const time = (elapsedTime / loop).toFixed(4);
      return time;
    }

    function cppwsMultiplyIntVec(src1, src2, res, n) {
      let pointer1 = module._malloc(src1.length * 4);
      let pointer2 = module._malloc(src2.length * 4);
      let pointer3 = module._malloc(res.length * 4);
      let offset1 = pointer1 / 4;
      let offset2 = pointer2 / 4;
      let offset3 = pointer3 / 4;
      module.HEAP32.set(src1, offset1);
      module.HEAP32.set(src2, offset2);
      let result = functions.multiplyIntVec(pointer1, pointer2, pointer3, n);
      res.set(module.HEAP32.subarray(offset3, offset3 + n));
      module._free(pointer1);
      module._free(pointer2);
      module._free(pointer3);
    }

    function rustwsMultiplyIntVec(src1, src2, res) {
      // Llama a la función Rust directamente
      rust_wasm.multiply_int_vector(src1, src2, res, src1.length);
    }

    // don't use Promise for the non Promise support browsers so far.
    setTimeout(function() {
      if (!checkFunctionality()) {
        document.getElementById("message").innerText =
          "Hay alguna función que no está bien implementada";
        document.getElementById("run_button").disabled = false;
        return;
      }
      setTimeout(function() {
        jsPerformance.innerText = run(jsMultiplyIntVec, src1, src2, res1, loop);
        setTimeout(function() {
          cwsPerformance.innerText = run(
            cppwsMultiplyIntVec,
            src1,
            src2,
            res2,
            loop
          );
          setTimeout(function() {
            rustwsPerformance.innerText = run(
              rustwsMultiplyIntVec,
              src1,
              src3,
              res3,
              loop
            );
            cwsComparison.innerText = (
              Number(jsPerformance.innerText) / Number(cwsPerformance.innerText)
            ).toFixed(4);
            rustwsComparison.innerText = (
              Number(jsPerformance.innerText) /
              Number(rustwsPerformance.innerText)
            ).toFixed(4);
            document.getElementById("message").innerText = "Done";
            document.getElementById("run_button").disabled = false;
          });
          document.getElementById("message").innerText =
            "Running Rust WebAssembly";
        });
        document.getElementById("message").innerText =
          "Running Cpp WebAssembly";
      });
      document.getElementById("message").innerText = "Running JavaScript";
    });
    document.getElementById("message").innerText = "Checking equality";
  }
}

function onReady() {
  if (!rust_load || !cpp_load) return;
  document.getElementById("run_button").disabled = false;
  document.getElementById("message").innerText = "Ready";
}

function timeNow() {
  // Obtenemos la fecha y hora actual
  const fechaActual = new Date();

  // Obtenemos las partes de la fecha
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11
  const dia = fechaActual.getDate();

  // Obtenemos las partes de la hora
  const horas = fechaActual.getHours();
  const minutos = fechaActual.getMinutes();
  const segundos = fechaActual.getSeconds();
  const milisegundos = fechaActual.getMilliseconds();

  // Formateamos la salida para asegurarnos de que tenga dos dígitos
  const formatoHora = (valor) => {
    return valor < 10 ? `0${valor}` : valor;
  };

  // Construimos la cadena de tiempo
  const cadenaTiempo = `${año}-${formatoHora(mes)}-${formatoHora(
    dia
  )} ${formatoHora(horas)}:${formatoHora(minutos)}:${formatoHora(
    segundos
  )}.${milisegundos}`;

  return cadenaTiempo;
}
