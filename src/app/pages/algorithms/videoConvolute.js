import init, {
  image_convolute as rust_image_convolute,
} from "/libs/imageConvolute/rust/image_convolute";

let rust_load = false;
let cpp_load = false;
let stop = true;
let selectedLanguage = "";
// Variable global para almacenar el módulo y las funciones de C
let module,
  functions = {};

const SCRIPT_C_TAG = "wasm-videoConvolute";

/**
 * Funcion para cargar el modulo de WebAssembly de Rust
 */
const loadWasmRust = async () => {
  await init();
  rust_load = true;
  console.info("rust loaded");
  onReady();
};

const togglesInit = () => {
  const jsToggle = document.getElementById("jsToggle");
  const cToggle = document.getElementById("cToggle");
  const rustToggle = document.getElementById("rustToggle");
  jsToggle.checked = true;
  selectedLanguage = "js";
  jsToggle.addEventListener("change", function() {
    if (jsToggle.checked) {
      selectedLanguage = "js";
      cToggle.checked = false; // Desactivar los otros toggles
      rustToggle.checked = false;
    }
  });

  cToggle.addEventListener("change", function() {
    if (cToggle.checked) {
      selectedLanguage = "c";
      jsToggle.checked = false;
      rustToggle.checked = false;
    }
  });

  rustToggle.addEventListener("change", function() {
    if (rustToggle.checked) {
      selectedLanguage = "rust";
      jsToggle.checked = false;
      cToggle.checked = false;
    }
  });
};

const switchFunctionButton = () => {
  let button = document.getElementById("run_button");
  if (button.innerText === "Stop") {
    button.innerText = "Run convolute";
    stop = true;
  } else {
    button.innerText = "Stop";
    stop = false;
  }
};

const jsImageConvolute = (
  data,
  data2,
  width,
  height,
  weights,
  wwidth,
  wheight
) => {
  let halfWWidth = (wwidth / 2) | 0;
  let halfWHeight = (wheight / 2) | 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let wy = 0; wy < wheight; wy++) {
        let sy = y + wy - halfWHeight;
        if (sy < 0 || sy >= height) continue;
        for (let wx = 0; wx < wwidth; wx++) {
          let sx = x + wx - halfWWidth;
          if (sx < 0 || sx >= width) continue;
          let index = sy * width + sx;
          let weight = weights[wy * wwidth + wx];
          r += data[index * 4 + 0] * weight;
          g += data[index * 4 + 1] * weight;
          b += data[index * 4 + 2] * weight;
          a += data[index * 4 + 3] * weight;
        }
      }
      let index = y * width + x;
      data2[index * 4 + 0] = r | 0;
      data2[index * 4 + 1] = g | 0;
      data2[index * 4 + 2] = b | 0;
      data2[index * 4 + 3] = a | 0;
    }
  }
};

const loadWasm = async () => {
  try {
    loadWasmRust();
    // Cargar el módulo de WebAssembly al iniciar el componente
    loadWasmCpp(
      "libs/imageConvolute/cpp/imageConvolute.js",
      "libs/imageConvolute/cpp/imageConvolute.wasm"
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
        functions.imageConvolute = module.cwrap("imageConvolute", null, [
          "number",
          "number",
          "number",
          "number",
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

const addThreeJsHead = () => {
  const head = document.head;
  const script = document.createElement("script");
  script.src = "https://rawgit.com/mrdoob/three.js/r85/build/three.js";
  script.id = "threejs";
  head.appendChild(script);
}

const deleteThreeJsHead = () => {
  const head = document.head;
  const script = document.getElementById("threejs");
  if (script) {
    head.removeChild(script);
  }
}

/**
 * Función para ejecutar la convolución de la imagen
 */
const start = () => {
  stop = false;
  const video = document.getElementById("original_video");
  const width = video.videoWidth;
  const height = video.videoHeight;
  let length = width * height * 4;
  const loop = 10;

  let renderer = new THREE.WebGLRenderer({ antialias: true });
  let gl = renderer.getContext();
  let texture = new THREE.Texture(video);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.format = THREE.RGBAFormat;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  let renderTarget = new THREE.WebGLRenderTarget(width, height);

  let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  let scene = new THREE.Scene();
  let shader = {
    uniforms: {
      tDiffuse: { value: null },
    },
    vertexShader: [
      "varying vec2 vUv;",
      "void main() {",
      "	vUv = uv;",
      "	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join("\n"),
    fragmentShader: [
      "uniform sampler2D tDiffuse;",
      "varying vec2 vUv;",
      "void main() {",
      "	gl_FragColor = texture2D(tDiffuse, vec2(vUv.x, 1.0-vUv.y));",
      "}",
    ].join("\n"),
  };

  let material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(shader.uniforms),
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
  });
  material.uniforms["tDiffuse"].value = texture;
  let quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
  quad.frustumCulled = false; // Avoid getting clipped
  scene.add(quad);

  let weights = new Float64Array([
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
  ]);
  let wWidth = 5;
  let wHeight = 5;

  //document.getElementById("run_button").disabled = true;
  let jsPerformance = document.getElementById("js_performance");
  let cwsPerformance = document.getElementById("c_ws_performance");
  let rustwsPerformance = document.getElementById("rust_ws_performance");

  // jsPerformance.innerText = "";
  // cwsPerformance.innerText = "";
  // rustwsPerformance.innerText = "";

  let jsCanvas = document.getElementById("js_canvas");
  jsCanvas.width = width;
  jsCanvas.height = height;
  let jsContext = jsCanvas.getContext("2d");

  let cwsCanvas = document.getElementById("cws_canvas");
  cwsCanvas.width = width;
  cwsCanvas.height = height;
  let cwsContext = cwsCanvas.getContext("2d");

  let rustwsCanvas = document.getElementById("rustws_canvas");
  rustwsCanvas.width = width;
  rustwsCanvas.height = height;
  let rustwsContext = rustwsCanvas.getContext("2d");

  let uint8Array = new Uint8Array(module.HEAPU8.buffer);

  // for Original
  let pointer1 = module._malloc(length);
  let offset1 = pointer1;
  let array0 = uint8Array.subarray(offset1, offset1 + length);
  updateOriginalImageData();

  // for JavaScript
  let array1 = new Uint8ClampedArray(length);
  let jsImageData = new ImageData(array1, width, height);

  // for C WebAssembly
  let pointer2 = module._malloc(length);
  let pointer3 = module._malloc(weights.length * 8);
  let offset2 = pointer2;
  let offset3 = pointer3 / 8;
  module.HEAPF64.set(weights, offset3);
  uint8Array = new Uint8ClampedArray(module.HEAPU8.buffer);
  let array2 = uint8Array.subarray(offset2, offset2 + length);
  let cwsImageData = new ImageData(array2, width, height);

  // for Rust WebAssembly
  let array3 = new Uint8ClampedArray(length);
  let rustwsImageData = new ImageData(array3, width, height);

  function updateOriginalImageData() {
    texture.needsUpdate = true;
    renderer.render(scene, camera, renderTarget);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, array0);
  }

  function equalArray(array1, array2) {
    if (array1.length !== array2.length) return false;
    for (let i = 0, il = array1.length; i < il; i++) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  }

  function checkFunctionality() {
    jsImageConvolute(array0, array1, width, height, weights, wWidth, wHeight);
    cwsImageConvolute(array0, array2, width, height, weights, wWidth, wHeight);
    runRustWasm(array0, array3, width, height, weights, wWidth, wHeight);
    jsContext.putImageData(jsImageData, 0, 0);
    cwsContext.putImageData(cwsImageData, 0, 0);
    rustwsContext.putImageData(rustwsImageData, 0, 0);
    return equalArray(array1, array2) && equalArray(array1, array3);
  }

  function showCanvas() {
    if (selectedLanguage === "js") {
      jsCanvas.style.display = "inline";
      cwsCanvas.style.display = "none";
      rustwsCanvas.style.display = "none";
    } else if (selectedLanguage === "c") {
      jsCanvas.style.display = "none";
      cwsCanvas.style.display = "inline";
      rustwsCanvas.style.display = "none";
    } else if (selectedLanguage === "rust") {
      jsCanvas.style.display = "none";
      cwsCanvas.style.display = "none";
      rustwsCanvas.style.display = "inline";
    }
  }

  function run(func, array, width, height, loop) {
    let elapsedTime = 0.0;
    for (let i = 0; i < loop; i++) {
      let startTime = performance.now();
      func(array0, array, width, height, weights, wWidth, wHeight);
      let endTime = performance.now();
      elapsedTime += endTime - startTime;
    }
    return elapsedTime / loop;
  }

  function cwsImageConvolute(
    array1,
    array2,
    width,
    height,
    weights,
    wWidth,
    wHeight
  ) {
    functions.imageConvolute(
      pointer1,
      pointer2,
      width,
      height,
      pointer3,
      wWidth,
      wHeight
    );
  }

  function runRustWasm(data1, data2, width, height, weights, wWidth, wHeight) {
    rust_image_convolute(data1, data2, width, height, weights, wWidth, wHeight);
  }

  let jsElapsedTime = 0.0;
  let cwsElapsedTime = 0.0;
  let rustwsElapsedTime = 0.0;
  let count = 0;

  function render() {
    updateOriginalImageData();
    if (selectedLanguage === "js") {
      jsElapsedTime += run(jsImageConvolute, array1, width, height, 1);
      jsContext.putImageData(jsImageData, 0, 0);
    } else if (selectedLanguage === "c") {
      cwsElapsedTime += run(cwsImageConvolute, array2, width, height, 1);
      cwsContext.putImageData(cwsImageData, 0, 0);
    } else if (selectedLanguage === "rust") {
      rustwsElapsedTime += run(runRustWasm, array3, width, height, 1);
      rustwsContext.putImageData(rustwsImageData, 0, 0);
    }
    count++;

    if (count === loop) {
      if (selectedLanguage === "js") {
        jsPerformance.innerText = (jsElapsedTime / loop).toFixed(4);
        jsElapsedTime = 0.0;
      } else if (selectedLanguage === "c") {
        cwsPerformance.innerText = (cwsElapsedTime / loop).toFixed(4);
        cwsElapsedTime = 0.0;
      } else if (selectedLanguage === "rust") {
        rustwsPerformance.innerText = (rustwsElapsedTime / loop).toFixed(4);
        rustwsElapsedTime = 0.0;
      }

      count = 0;
    }
    if (stop) {
      document.getElementById("run_button").disabled = false;
      document.getElementById("message").innerText = "Ready";
      return;
    }
    requestAnimationFrame(render);
  }

  // don't use Promise for the non Promise support browsers so far.
  setTimeout(function() {
    if (!checkFunctionality()) {
      document.getElementById("message").innerText =
        "Hay alguna función que no está bien implementada";
      document.getElementById("run_button").disabled = false;
      return;
    }
    showCanvas();
    render();
    document.getElementById("message").innerText = "Running";
    switchFunctionButton();
  });
  document.getElementById("message").innerText = "Checking equality";
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
  addThreeJsHead();
  loadWasm();
  document.getElementById("run_button")?.addEventListener("click", start);
  togglesInit();
};

/**
 * Funcion para limpiar el componente
 */
const cleanupComponent = () => {
  const script = document.getElementById(SCRIPT_C_TAG);
  if (script) {
    document.head.removeChild(script);
  }
  deleteThreeJsHead();
};

// Llamada a la función de limpieza al cambiar la ruta
window.addEventListener("hashchange", cleanupComponent);

const VideoConvolute = () => {
  const view = /*html*/ `
    <div class="container default-column center">
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
          <!-- Rounded switch -->
          <div class="toggles">
            <label class="toggle js-toggle">
              <span class="toggle-label">Js</span>
              <input class="toggle-checkbox" type="checkbox" id="jsToggle" />
              <div class="toggle-switch"></div>
            </label>
            <label class="toggle c-toggle">
              <span class="toggle-label">C</span>
              <input class="toggle-checkbox" type="checkbox" id="cToggle" />
              <div class="toggle-switch"></div>
            </label>
            <label class="toggle rust-toggle">
              <span class="toggle-label">Rust</span>
              <input class="toggle-checkbox" type="checkbox" id="rustToggle" />
              <div class="toggle-switch"></div>
            </label>
          </div>
          <br />
          <button id="run_button" class="button-run pure-button" disabled>
            Run convolute
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
          </p>
        </div>
        <div style="border-bottom: 1px solid; width: 100%"></div>
        <div>
          <span>
            Original<br />
            <video
              id="original_video"
              loop
              autoplay
              muted
              src="/assets/videos/video.mp4"
              type="video/mp4"
              width="50%"
            ></video
            ><br />
            JavaScript<br />
            <canvas id="js_canvas" style="width: 50%;"></canvas><br />
            C Wasm<br />
            <canvas id="cws_canvas" style="width: 50%;"></canvas><br />
            Rust Wasm<br />
            <canvas id="rustws_canvas" style="width: 50%;"></canvas><br />
          </span>
        </div>
      </div>
    </div>
    <style>
      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, ".SFNSText-Regular", "Helvetica Neue",
          "Roboto", "Segoe UI", sans-serif;
      }

      .toggle {
        cursor: pointer;
        display: inline-block;
      }
      .toggle-switch {
        display: inline-block;
        background: #ccc;
        border-radius: 16px;
        width: 38px;
        height: 22px;
        position: relative;
        vertical-align: middle;
        transition: background 0.25s;
        &:before,
        &:after {
          content: "";
        }
        &:before {
          display: block;
          background: linear-gradient(to bottom, #fff 0%, #eee 100%);
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
          width: 14px;
          height: 14px;
          position: absolute;
          top: 4px;
          left: 4px;
          transition: left 0.25s;
        }
        .toggle:hover &:before {
          background: linear-gradient(to bottom, #fff 0%, #fff 100%);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
        }
        .toggle-checkbox:checked + & {
          background: #6923d0;
          &:before {
            left: 20px;
          }
        }
      }
      .js-toggle .toggle-checkbox:checked + .toggle-switch {
        background: #F7E03A;
      }
      .c-toggle .toggle-checkbox:checked + .toggle-switch {
        background: #01589C;
      }
      .rust-toggle .toggle-checkbox:checked + .toggle-switch {
        background: #F75440;
      }
      .toggle-checkbox {
        position: absolute;
        visibility: hidden;
      }
      .toggle-label {
        margin-left: 5px;
        position: relative;
        top: 2px;
      }
      .toggles {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 4px;
      }
    </style>
    `;
  setTimeout(initComponent, 0);
  return view;
};

export default VideoConvolute;
