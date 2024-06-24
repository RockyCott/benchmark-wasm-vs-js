import init, {
  sum_consecutiva as rust_sum_consecutiva,
} from "/libs/sumConsecutiva/rust/sum_consecutiva";

let rust_load = false;


/**
 * Funcion para cargar el modulo de WebAssembly de Rust
 */
const loadWasmRust = async () => {
  await init();
  rust_load = true;
  console.info("rust loaded");
  onReady();
};

const loadWasm = async () => {
  try {
    loadWasmRust();
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
};

function jsSumConsecutiva(n) {
  let sum = ((1 + n) * n) / 2;
  return sum;
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


/**
 * Función para ejecutar Fibonacci
 */
const start = () => {
  // obtener el valor del input
  const num = Number(document.getElementById("stacked-number")?.value);
  const loop = Number(document.getElementById("stacked-loops")?.value);
  // Ejecuta la función fib del módulo de WebAssembly si está cargado
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
      const time = (endTime - startTime) / loop;
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
          rustwsPerformance.innerText = run(
            rust_sum_consecutiva,
            BigInt(num),
            loop
          );
          rustwsComparison.innerText =
            Number(jsPerformance.innerText) /
            Number(rustwsPerformance.innerText);
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
};

const onReady = () => {
  if (!rust_load) return;
  document.getElementById("run_button").disabled = false;
  document.getElementById("message").innerText = "Ready";
};

/**
 * Función para inicializar el componente
 */
const initComponent = () => {
  loadWasm();
  document.getElementById("run_button")?.addEventListener("click", start);
};

const SumConsecutiva = () => {
  const view = /*html*/ `
    <div class="container default-column center">
      <p>
        La idea es probar la suma consecutiva de números naturales, es decir, si
        tenemos el número 5, la suma consecutiva sería 1 + 2 + 3 + 4 + 5 = 15.
        Todo esto utilizando la fórmula de la serie aritmética.
        Este algoritmo solamente se ejecutará en JavaScript y en Rust+Wasm, para poder
        probar el manejo de punto flotante de 64 bits en WebAssembly.

      </p>
      <div class="w80 default-column fieldset center">
        <div class="w100" style="border-bottom: 1px solid">
          <br />
          <span
            >Component Status:
            <span id="message" style="font-weight: bold"
              >Loading WebAssembly</span
            ></span
          >
          <br />
          <h3>Configure</h3>
          <form class="default-column center pure-form pure-form-stacked">
            <label for="stacked-number">Number</label>
            <input type="number" id="stacked-number" placeholder="Number" />
            <label for="stacked-loops">Loops</label>
            <input type="number" id="stacked-loops" placeholder="Loop number" />
            <br />
          </form>
          <button id="run_button" class="button-run pure-button" disabled>
            Run Add
          </button>

          <br />
          <br />
        </div>
        <div>
          <h3>Results (average [ms])</h3>
          <p>
            JavaScript: <span id="js_performance"></span><br />
            Rust-Wasm: <span id="rust_ws_performance"></span><br />
            JavaScript/Rust-Wasm: <span id="rust_ws_comparison"></span><br />
          </p>
        </div>
      </div>
    </div>
    `;
  setTimeout(initComponent, 0);
  return view;
};

export default SumConsecutiva;
