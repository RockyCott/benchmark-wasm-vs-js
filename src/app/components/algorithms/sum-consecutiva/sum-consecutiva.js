import init, {
  sum_consecutiva as rust_sum_consecutiva,
} from "./libs/rust/pkg/sum_consecutiva.js";
// import * as wasm from "./rust2/fibRust.js";
let rust_load = false;

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

function jsSumConsecutiva(n) {
  // sumar numeros consecutivos desde el 1 en adelante
  let sum = (1+n)*n/2;
  return sum;
}

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
    let rustwsPerformance = document.getElementById("rust_ws_performance");

    let rustwsComparison = document.getElementById("rust_ws_comparison");

    jsPerformance.innerText = "";
    rustwsPerformance.innerText = "";

    rustwsComparison.innerText = "";

    function checkFunctionality(n) {
      console.log(timeNow());
      const rustwsResult = rust_sum_consecutiva(BigInt(n));
      console.log("Rust Wasm Result", rustwsResult);
      console.log(timeNow());
      const jsResult = jsSumConsecutiva(n);
      console.log("Js Result", jsResult);
      console.log(timeNow());
      // evaluar si los tres valores son iguales
      return jsResult == rustwsResult;
    }

    function run(func, n, loop) {
      func(n); // warm-up
      let startTime = performance.now();
      for (let i = 0; i < loop; i++) {
        func(n);
      }
      let endTime = performance.now();
      const time = ((endTime - startTime) / loop);
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
        jsPerformance.innerText = run(jsSumConsecutiva, num, loop);
        setTimeout(function() {
          rustwsPerformance.innerText = run(rust_sum_consecutiva, BigInt(num), loop);
          rustwsComparison.innerText = (
            Number(jsPerformance.innerText) /
            Number(rustwsPerformance.innerText)
          );
          document.getElementById("message").innerText = "Done";
          document.getElementById("run_button").disabled = false;
        });
        document.getElementById("message").innerText =
          "Running Rust WebAssembly";
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
