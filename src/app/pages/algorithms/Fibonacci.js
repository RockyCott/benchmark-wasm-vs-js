import init, { fib as rust_fibonacci } from "/libs/fibonacci/rust/fibRust";

let rust_load = false;
let cpp_load = false;
// Variable global para almacenar el módulo y las funciones de C
let module,
  functions = {};

const SCRIPT_C_TAG = "wasm-fibonacci";

/**
 * Funcion para cargar el modulo de WebAssembly de Rust
 */
const loadWasmRust = async () => {
  await init();
  rust_load = true;
  console.info("rust loaded");
  onReady();
};

/**
 * Función para ejecutar Fibonacci en JavaScript
 * @param {*} n - Número para calcular el Fibonacci
 * @returns - Resultado del cálculo
 */
const jsFib = (n) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return jsFib(n - 1) + jsFib(n - 2);
};

const loadWasm = async () => {
  try {
    loadWasmRust();
    // Cargar el módulo de WebAssembly al iniciar el componente
    loadWasmCpp("libs/fibonacci/cpp/fib.js", "libs/fibonacci/cpp/fib.wasm");
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
};

// Función para cargar el módulo de WebAssembly y el script JS
const loadWasmCpp = async (srcScript, srcWasm) => {
  try {
    // Cargar el script JavaScript
    await fetch(srcScript)
      .then((response) => response.text())
      .then((text) => {
        const script = document.createElement("script");
        script.innerHTML = text;
        script.type = "text/javascript";
        script.id = SCRIPT_C_TAG;
        document.head.appendChild(script);
      });
    // Cargar el archivo wasm y configurar el módulo
    const wasmBinary = await fetch(srcWasm)
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));

    let moduleArgs = {
      wasmBinary,
      onRuntimeInitialized: function() {
        functions.fib = module.cwrap("fib", "number", ["number"]);
        cpp_load = true;
        console.info("cpp loaded");
        onReady();
      },
    };
    module = Module(moduleArgs);
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
    throw error;
  }
};

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
    let cwsPerformance = document.getElementById("c_ws_performance");
    let rustwsPerformance = document.getElementById("rust_ws_performance");

    let cwsComparison = document.getElementById("c_ws_comparison");
    let rustwsComparison = document.getElementById("rust_ws_comparison");

    jsPerformance.innerText = "";
    cwsPerformance.innerText = "";
    rustwsPerformance.innerText = "";

    cwsComparison.innerText = "";
    rustwsComparison.innerText = "";

    function checkFunctionality(n) {
      const rustwsResult = rust_fibonacci(n);
      console.info("Rust Wasm Result", rustwsResult);
      const cwsResult = functions.fib(n);
      console.info("C Wasm Result", cwsResult);
      const jsResult = jsFib(n);
      console.info("Js Result", jsResult);

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
          "Hay alguna función que no está bien implementada.";
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
};

const onReady = () => {
  if (!rust_load || !cpp_load) return;
  document.getElementById("run_button").disabled = false;
  document.getElementById("message").innerText = "Ready";
};

/**
 * Función para inicializar el componente
 */
const initComponent = () => {
  loadWasm();
  document
    .getElementById("run_button")
    ?.addEventListener("click", start);
};

/**
 * Funcion para limpiar el componente
 */
const cleanupComponent = () => {
  const script = document.getElementById(SCRIPT_C_TAG);
  if (script) {
    document.head.removeChild(script);
  }
};

// Llamada a la función de limpieza al cambiar la ruta
window.addEventListener("hashchange", cleanupComponent);

const Fibonacci = () => {
  const view = /*html*/ `
    <div class="container default-column center">
      <div class="w80 default-column fieldset center">
        <div class="w100" style="border-bottom: 1px solid">
          <br />
          <span
            >Component Status:
            <span id="message" style="font-weight: bold">Loading WebAssembly</span></span
          >
          <br />
          <h3>Configure</h3>
          <form class="default-column center pure-form pure-form-stacked">
            <label for="stacked-number">Number</label>
            <input type="number" id="stacked-number" placeholder="Number" value="30" />
            <label for="stacked-loops">Loops</label>
            <input type="number" id="stacked-loops" placeholder="Loop number" value="10" />
            <br />
          </form>
          <button id="run_button" class="button-run pure-button" disabled>
            Run Fibonacci
          </button>

          <br />
          <br />
        </div>
        <div>
          <h3>Results (average [ms])</h3>
          <p>
            JavaScript: <span id="js_performance"></span><br />
            Cpp-Wasm: <span id="c_ws_performance"></span><br />
            Rust-Wasm: <span id="rust_ws_performance"></span><br />
            JavaScript/Cpp-Wasm: <span id="c_ws_comparison"></span><br />
            JavaScript/Rust-Wasm: <span id="rust_ws_comparison"></span
            ><br />
          </p>
        </div>
      </div>
    </div>
    `;
  setTimeout(initComponent, 0);
  return view;
};

export default Fibonacci;
