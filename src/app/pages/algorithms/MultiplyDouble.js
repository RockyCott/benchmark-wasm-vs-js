import init, {
  multiply_double as rust_multiply_double,
} from "/libs/multiplyDouble/rust/multiply_double";

let rust_load = false;
let cpp_load = false;
const SCRIPT_C_TAG = "wasm-multiplyDouble";
// Variable global para almacenar el módulo y las funciones de C
let module,
  functions = {};

/**
 * Funcion para cargar el modulo de WebAssembly de Rust
 */
const loadWasmRust = async () => {
  await init();
  rust_load = true;
  console.info("rust loaded");
  onReady();
};

const jsMultiplyDouble = (a, b, n) => {
  let c = 1.0;
  for (let i = 0; i < n; i++) {
    c = c * a * b;
  }
  return c;
};

const loadWasm = async () => {
  try {
    loadWasmRust();
    // Cargar el módulo de WebAssembly al iniciar el componente
    const ruta = "libs/multiplyDouble/cpp/";
    loadWasmCpp(`${ruta}multiplyDouble.js`, `${ruta}multiplyDouble.wasm`);
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
        functions.multiplyDouble = module.cwrap("multiplyDouble", "number", [
          "number",
          "number",
          "number",
        ]);
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
 * Función para ejecutar Collision Detection
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
      const rustwsResult = rust_multiply_double(1.0, 1.0, n);
      const cwsResult = functions.multiplyDouble(1.0, 1.0, n);
      const jsResult = jsMultiplyDouble(1.0, 1.0, n);
      // evaluar si los tres valores son iguales
      return jsResult === cwsResult && jsResult === rustwsResult;
    }

    function run(func, n, loop) {
      func(1.0, 1.0, n); // warm-up
      let elapsedTime = 0.0;
      for (let i = 0; i < loop; i++) {
        const startTime = performance.now();
        func(1.0, 1.0, n);
        const endTime = performance.now();
        elapsedTime += endTime - startTime;
      }
      const time = (elapsedTime / loop).toFixed(10);
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
        jsPerformance.innerText = run(jsMultiplyDouble, num, loop);
        setTimeout(function() {
          cwsPerformance.innerText = run(functions.multiplyDouble, num, loop);
          setTimeout(function() {
            rustwsPerformance.innerText = run(rust_multiply_double, num, loop);
            cwsComparison.innerText = (
              Number(jsPerformance.innerText) / Number(cwsPerformance.innerText)
            ).toFixed(10);
            const js_performanceInnerText = Number(jsPerformance.innerText);
            const rustws_performanceInnerText = Number(rustwsPerformance.innerText);
            const calc = js_performanceInnerText / rustws_performanceInnerText;
            rustwsComparison.innerText = calc === Infinity ? "0.0" : calc.toFixed(10);
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
  document.getElementById("run_button")?.addEventListener("click", start);
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

const MultiplyDouble = () => {
  const view = /*html*/ `
      <div class="container default-column center">
          <p>
            Un calculo de multiplicación de dos números en coma flotante.
          </p>
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
                  <label for="stacked-number">Warm-up run loops</label>
                  <input type="number" id="stacked-number" placeholder="Number" value="100000" />
                  <label for="stacked-loops">Warm-up run loops</label>
                  <input type="number" id="stacked-loops" placeholder="Loop number" value="10" />
              </form>
              <br />
              <button id="run_button" class="button-run pure-button" disabled>
                  Run Power
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

export default MultiplyDouble;
