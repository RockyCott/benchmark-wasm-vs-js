import init, {
  quicksort_double as rust_quicksort_double,
} from "./libs/rust/pkg/quicksort_double.js";
// import * as wasm from "./rust2/fibRust.js";
let rust_load = false;
let cpp_load = false;

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

function jsQuicksortDouble(array, start, end) {
  if (start >= end) return;
  let pivot = array[end];
  let left = 0;
  let right = 0;
  while (left + right < end - start) {
    let num = array[start + left];
    if (num < pivot) {
      left++;
    } else {
      array[start + left] = array[end - right - 1];
      array[end - right - 1] = pivot;
      array[end - right] = num;
      right++;
    }
  }
  jsQuicksortDouble(array, start, start + left - 1);
  jsQuicksortDouble(array, start + left + 1, end);
}

// fibonacci escrito en rust

let module,
  functions = {};
fetch("libs/cpp/quicksortDouble.wasm")
  .then((response) => response.arrayBuffer())
  .then((buffer) => new Uint8Array(buffer))
  .then((binary) => {
    let moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: function() {
        functions.quicksortDouble = module.cwrap("quicksortDouble", null, [
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

    let array0 = new Float64Array(num); // master
    let array1 = new Float64Array(num); // for JavaScript
    let array2 = new Float64Array(num); // for c WebAssembly
    let array3 = new Float64Array(num); // for rust WebAssembly

    initArray(array0);

    function initArray(array) {
      for (let i = 0, il = array.length; i < il; i++) {
        array[i] = ((Math.random() * 20000) | 0) - 10000;
      }
    }

    function copyArray(src, res) {
      for (let i = 0, il = src.length; i < il; i++) {
        res[i] = src[i];
      }
    }

    function equalArray(array1, array2) {
      if (array1.length !== array2.length) return false;
      for (let i = 0, il = array1.length; i < il; i++) {
        if (array1[i] !== array2[i]) return false;
      }
      return true;
    }

    function orderIsOk(array) {
      for (let i = 1, il = array.length; i < il; i++) {
        if (array[i - 1] > array[i]) return false;
      }
      return true;
    }

    function checkFunctionality() {
      copyArray(array0, array1);
      copyArray(array0, array2);
      copyArray(array0, array3);
      jsQuicksortDouble(array1, 0, array1.length - 1);
      cwsQuicksortDouble(array2, 0, array2.length - 1);
      rustwsQuicksortDouble(array3, 0, array3.length - 1);
      if (!orderIsOk(array1)) return false;
      return equalArray(array1, array2) && equalArray(array1, array3);
    }

    function run(func, array, loop) {
      copyArray(array0, array);
      func(array, 0, array.length - 1); // warm-up
      let elapsedTime = 0.0;
      for (let i = 0; i < loop; i++) {
        copyArray(array0, array);
        let startTime = performance.now();
        func(array, 0, array.length - 1);
        let endTime = performance.now();
        elapsedTime += endTime - startTime;
      }
      return (elapsedTime / loop).toFixed(4);
    }

    function cwsQuicksortDouble(array, start, end) {
      let pointer = module._malloc(array.length * 8);
      let offset = pointer / 8;
      module.HEAPF64.set(array, offset);
      functions.quicksortDouble(pointer, start, end);
      array.set(module.HEAPF64.subarray(offset, offset + end + 1));
      module._free(pointer);
    }

    function rustwsQuicksortDouble(array, start, end) {
      console.log(array, start, end);
      rust_quicksort_double(array, start, end);
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
        jsPerformance.innerText = run(jsQuicksortDouble, array1, loop);
        setTimeout(function() {
          cwsPerformance.innerText = run(cwsQuicksortDouble, array2, loop);
          setTimeout(function() {
            rustwsPerformance.innerText = run(
              rustwsQuicksortDouble,
              array3,
              loop
            );
            cwsComparison.innerText = (
              Number(jsPerformance.innerText) / Number(cwsPerformance.innerText)
            ).toFixed(10);
            rustwsComparison.innerText = (
              Number(jsPerformance.innerText) /
              Number(rustwsPerformance.innerText)
            ).toFixed(10);
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
