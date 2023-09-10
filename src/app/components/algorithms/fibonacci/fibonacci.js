import init, { fibonacci as rust_fibonacci } from "./libs/rust/pkg/fibonacci.js";
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
  // await wasm.default();
  console.log("rust loaded");
  onReady();
}

rustLoad();

// esperar a que cargue el body
document.addEventListener("DOMContentLoaded", ngInit);

function jsFib(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return jsFib(n - 1) + jsFib(n - 2);
}

// fibonacci escrito en rust

let module,
  functions = {};
fetch("libs/cpp/fib.wasm")
  .then((response) => response.arrayBuffer())
  .then((buffer) => new Uint8Array(buffer))
  .then((binary) => {
    let moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: function() {
        functions.fib = module.cwrap("fib", "number", ["number"]);
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
    // let rust2wsPerformance = document.getElementById("rust2_ws_performance");

    let cwsComparison = document.getElementById("c_ws_comparison");
    let rustwsComparison = document.getElementById("rust_ws_comparison");
    // let rust2wsComparison = document.getElementById("rust2_ws_comparison");

    jsPerformance.innerText = "";
    cwsPerformance.innerText = "";
    rustwsPerformance.innerText = "";
    // rust2wsPerformance.innerText = "";

    cwsComparison.innerText = "";
    rustwsComparison.innerText = "";
    // rust2wsComparison.innerText = "";

    function checkFunctionality(n) {
      const rustwsResult = rust_fibonacci(n);
      console.log("Rust Wasm Result", rustwsResult);
      const cwsResult = functions.fib(n);
      console.log("C Wasm Result", cwsResult);
      const jsResult = jsFib(n);
      console.log("Js Result", jsResult);
      // const rustws2Result = wasm.fib(n);
      // evaluar si los tres valores son iguales
      return jsResult === cwsResult && jsResult === rustwsResult;
    }

    function run(func, n, loop) {
      func(n); // warm-up
      let startTime = performance.now();
      for (let i = 0; i < loop; i++) {
        func(n);
      }
      let endTime = performance.now();
      const time = ((endTime - startTime) / loop).toFixed(8);
      return time;
    }

    // don't use Promise for the non Promise support browsers so far.
    setTimeout(function() {
      if (!checkFunctionality(num)) {
        document.getElementById("message").innerText =
          "Hay alguna función que no está bien implementada";
        document.getElementById("run_button").disabled = false;
        return;
      }
      setTimeout(function() {
        jsPerformance.innerText = run(jsFib, num, loop);
        setTimeout(function() {
          cwsPerformance.innerText = run(functions.fib, num, loop);
          setTimeout(function() {
            rustwsPerformance.innerText = run(rust_fibonacci, num, loop);
            cwsComparison.innerText = (
              Number(jsPerformance.innerText) / Number(cwsPerformance.innerText)
            ).toFixed(8);
            rustwsComparison.innerText = (
              Number(jsPerformance.innerText) /
              Number(rustwsPerformance.innerText)
            ).toFixed(8);
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

// tengo un algoritmo de tiempo de 1.5 segundos y otro que dura 2 segundos, como puedo hacer la comparacion del algoritmo 1 cuantas veces es mas rapdio que el 2

// function init() {
//   // putCode("test_code_area", document.getElementById("test_code").text.trim());
//   // putCode("js_code_area", document.getElementById("js_code").text.trim());

//   // loadTextFile("fib.c", function(text) {
//   //   putCode("ws_code_area", text.trim());
//   // });

//   // loadTextFile("fib.sh", function(text) {
//   //   putCode("sh_code_area", text.trim());
//   // });

//   // putCode(
//   //   "ws_instantiate_code_area",
//   //   document.getElementById("ws_instantiate_code").text.trim()
//   // );
// }
