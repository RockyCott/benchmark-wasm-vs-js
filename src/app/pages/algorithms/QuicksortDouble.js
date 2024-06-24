import init, {
  quicksort_double as rust_quicksort_double,
} from "/libs/quicksortDouble/rust/quick_sort_double";

let rust_load = false;
let cpp_load = false;
// Variable global para almacenar el módulo y las funciones de C
let module,
  functions = {};

const SCRIPT_C_TAG = "wasm-quicksortDouble";

/**
 * Funcion para cargar el modulo de WebAssembly de Rust
 */
const loadWasmRust = async () => {
  await init();
  rust_load = true;
  console.info("rust loaded");
  onReady();
};

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

const loadWasm = async () => {
  try {
    loadWasmRust();
    // Cargar el módulo de WebAssembly al iniciar el componente
    loadWasmCpp(
      "libs/quicksortDouble/cpp/quicksortDouble.js",
      "libs/quicksortDouble/cpp/quicksortDouble.wasm"
    );
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
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
    throw error;
  }
};

/**
 * Función para ejecutar QuicksortDouble
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

const QuicksortDouble = () => {
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

export default QuicksortDouble;
