import * as rust_wasm from "/libs/multiplyIntVector/rust/multiplyIntVecRust";
let rust_load = false;
let cpp_load = false;
const SCRIPT_C_TAG = "wasm-multiplyIntVector";
// Variable global para almacenar el módulo y las funciones de C
let module,
  functions = {};

/**
 * Funcion para cargar el modulo de WebAssembly de Rust
 */
const loadWasmRust = async () => {
  await rust_wasm.default();
  rust_load = true;
  console.info("rust loaded");
  onReady();
};

const jsMultiplyIntVec = (src1, src2, res, n) => {
  for (let i = 0; i < n; i++) {
    res[i] = src1[i] * src2[i];
  }
};

const loadWasm = async () => {
  try {
    loadWasmRust();
    // Cargar el módulo de WebAssembly al iniciar el componente
    const ruta = "/libs/multiplyIntVector/cpp/";
    loadWasmCpp(`${ruta}multiplyIntVec.js`, `${ruta}multiplyIntVec.wasm`);
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
        functions.multiplyIntVec = module.cwrap("multiplyIntVec", null, [
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

const MultiplyIntVector = () => {
  const view = /*html*/ `
        <div class="container default-column center">
            <p>
              Un calculo de multiplicación de los elementos de dos vectores de enteros pseudoaleatorios.
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

export default MultiplyIntVector;
