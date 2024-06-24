import init, {
  collision_detection as rust_collision_detection,
} from "/libs/collisionDetection/rust/collision_detection";

let rust_load = false;
let cpp_load = false;
const SCRIPT_C_TAG = "wasm-collisionDetection";
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

const jsCollisionDetection = (positions, radiuses, res, n) => {
  let count = 0;
  for (let i = 0; i < n; i++) {
    let p = positions[i];
    let r = radiuses[i];
    let collision = 0;
    for (let j = i + 1; j < n; j++) {
      let p2 = positions[j];
      let r2 = radiuses[j];
      let dx = p.x - p2.x;
      let dy = p.y - p2.y;
      let dz = p.z - p2.z;
      let d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (r > d) {
        collision = 1;
        count++;
        break;
      }
    }
    let index = (i / 8) | 0;
    let pos = 7 - (i % 8);
    if (collision === 0) {
      res[index] &= ~(1 << pos);
    } else {
      res[index] |= 1 << pos;
    }
  }
  return count;
};

const loadWasm = async () => {
  try {
    loadWasmRust();
    // Cargar el módulo de WebAssembly al iniciar el componente
    loadWasmCpp(
      "/libs/collisionDetection/cpp/collisionDetection.js",
      "/libs/collisionDetection/cpp/collisionDetection.wasm"
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
        functions.collisionDetection = module.cwrap(
          "collisionDetection",
          "number",
          ["number", "number", "number", "number"]
        );
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
 * Función para ejecutar Collision Detection
 */
const start = () => {
  // obtener el valor del input
  const warm_up_loops = Number(
    document.getElementById("stacked-number")?.value
  );
  const loop = Number(document.getElementById("stacked-loops")?.value);
  let elemNum = 0x4000;
  // Ejecuta la función fib del módulo de WebAssembly si está cargado
  if (warm_up_loops === 0 || loop === 0) {
    document.getElementById("message").innerText =
      "Please input both number and loop";
  } else if (warm_up_loops > 0 && loop > 0) {
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

    function Position(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    let positions = [];
    let radiuses = new Float64Array(elemNum);

    let res1 = new Uint8Array(elemNum / 8); // for JavaScript
    let res2 = new Uint8Array(elemNum / 8); // for WebAssembly
    let res3 = new Uint8Array(elemNum / 8); // for Rust WebAssembly
    initPositions(positions, elemNum);
    initRadiuses(radiuses);

    function initPositions(array, n) {
      for (let i = 0; i < n; i++) {
        let x = Math.random() * 2000 - 1000;
        let y = Math.random() * 2000 - 1000;
        let z = Math.random() * 2000 - 1000;
        array[i] = new Position(x, y, z);
      }
    }

    function initRadiuses(array) {
      for (let i = 0, il = array.length; i < il; i++) {
        array[i] = Math.random() * 10;
      }
    }

    function setPositionsToFloat64Array(positions, array, offset) {
      for (let i = 0, il = positions.length; i < il; i++) {
        let index = offset + i * 3;
        array[index + 0] = positions[i].x;
        array[index + 1] = positions[i].y;
        array[index + 2] = positions[i].z;
      }
    }

    function clearArray(array) {
      for (let i = 0, il = array.length; i < il; i++) {
        array[i] = 0;
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
      clearArray(res1);
      clearArray(res2);
      clearArray(res3);
      let count1 = jsCollisionDetection(positions, radiuses, res1, elemNum);
      let count2 = wsCollisionDetection(positions, radiuses, res2, elemNum);
      let count3 = runRustWasm(positions, radiuses, res3, elemNum);
      return (
        count1 === count2 &&
        count1 === count3 &&
        equalArray(res1, res2) &&
        equalArray(res1, res3)
      );
    }

    function run(func, positions, radiuses, res, n, loop, warm_up_loops) {
      for (let i = 0; i < warm_up_loops; i++) {
        func(positions, radiuses, res, n);
      }
      let elapsedTime = 0.0;
      for (let i = 0; i < loop; i++) {
        let startTime = performance.now();
        func(positions, radiuses, res, n);
        let endTime = performance.now();
        elapsedTime += endTime - startTime;
      }
      return (elapsedTime / loop).toFixed(4);
    }

    function wsCollisionDetection(positions, radiuses, res, n) {
      let pointer1 = module._malloc(positions.length * 3 * 8);
      let pointer2 = module._malloc(radiuses.length * 8);
      let pointer3 = module._malloc(res.length);
      let offset1 = pointer1 / 8;
      let offset2 = pointer2 / 8;
      let offset3 = pointer3;
      setPositionsToFloat64Array(positions, module.HEAPF64, offset1);
      module.HEAPF64.set(radiuses, offset2);
      let result = functions.collisionDetection(
        pointer1,
        pointer2,
        pointer3,
        n
      );
      res.set(module.HEAPU8.subarray(offset3, offset3 + res.length));
      module._free(pointer1);
      module._free(pointer2);
      module._free(pointer3);
      return result;
    }

    function runRustWasm(positions, radiuses, res, n) {
      return rust_collision_detection(
        { positions: positions },
        radiuses,
        res,
        n
      );
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
        jsPerformance.innerText = run(
          jsCollisionDetection,
          positions,
          radiuses,
          res1,
          elemNum,
          loop,
          warm_up_loops
        );
        setTimeout(function() {
          cwsPerformance.innerText = run(
            wsCollisionDetection,
            positions,
            radiuses,
            res2,
            elemNum,
            loop,
            warm_up_loops
          );
          setTimeout(function() {
            rustwsPerformance.innerText = run(
              runRustWasm,
              positions,
              radiuses,
              res3,
              elemNum,
              loop,
              warm_up_loops
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

const CollisionDetection = () => {
  const view = /*html*/ `
    <div class="container default-column center">
        <p>
        Un calculo realizado en el campo de la detección de colisiones
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
                <input type="number" id="stacked-number" placeholder="Number" value="1" />
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

export default CollisionDetection;
