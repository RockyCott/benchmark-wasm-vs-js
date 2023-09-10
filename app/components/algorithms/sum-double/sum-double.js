import init, {
  sum_double as rust_sum_double,
} from "./libs/rust/pkg/sum_double.js";
// import * as wasm from "./rust2/fibRust.js";
let rust_load = false;

function ngInit() {
  const boton = document.getElementById("run_button");
  boton.addEventListener("click", start);
}

async function rustLoad() {
  await init();
  rust_load = true;
  console.log("rust loaded");
  onReady();
}

rustLoad();

// esperar a que cargue el body
document.addEventListener("DOMContentLoaded", ngInit);

function jsSumDouble(array, n) {
  let s = 0;
  for (let i = 0; i < n; i++) {
    s += array[i];
  }
  return s;
}

let module,
  functions = {};
fetch("libs/cpp/sumDouble.wasm")
  .then((response) => response.arrayBuffer())
  .then((buffer) => new Uint8Array(buffer))
  .then((binary) => {
    let moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: function() {
        functions.sumDouble = module.cwrap("sumDouble", "number", [
          "number",
          "number",
        ]);
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

    let array = new Float64Array(num);

    initArray(array);

    function initArray(array) {
      for (let i = 0, il = array.length; i < il; i++) {
        array[i] = Math.random() * 20000 - 10000;
      }
    }

    function checkFunctionality(array, n) {
      const jsResult = jsSumDouble(array, n);
      const cwsSumResult = cwsSumDouble(array, n);
      const rustwsResult = rustwsSumDouble(array, n);
      return jsResult == rustwsResult && jsResult == cwsSumResult;
    }

    function run(func, array, loop) {
      func(array, array.length); // warm-up
      let elapsedTime = 0.0;
      for (let i = 0; i < loop; i++) {
        let startTime = performance.now();
        func(array, array.length);
        let endTime = performance.now();
        elapsedTime += endTime - startTime;
      }
      return (elapsedTime / loop).toFixed(4);
    }

    function cwsSumDouble(array, n) {
      let pointer = module._malloc(array.length * 8);
      let offset = pointer / 8;
      module.HEAPF64.set(array, offset);
      let result = functions.sumDouble(pointer, n);
      module._free(pointer);
      return result;
    }

    function rustwsSumDouble(array, n) {
      return rust_sum_double(array, n);
    }

    // don't use Promise for the non Promise support browsers so far.
    setTimeout(function() {
      if (!checkFunctionality(array, num)) {
        document.getElementById("message").innerText =
          "Hay alguna función que no está bien implementada";
        document.getElementById("run_button").disabled = false;
        return;
      }
      setTimeout(function() {
        jsPerformance.innerText = run(jsSumDouble, array, loop);
        setTimeout(function() {
          cwsPerformance.innerText = run(cwsSumDouble, array, loop);
          setTimeout(function() {
            rustwsPerformance.innerText = run(rustwsSumDouble, array, loop);
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
        document.getElementById("message").innerText = "Running C WebAssembly";
      });
      document.getElementById("message").innerText = "Running JavaScript";
    });
    document.getElementById("message").innerText = "Checking equality";
  }
}

function onReady() {
  if (!rust_load) return;
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
