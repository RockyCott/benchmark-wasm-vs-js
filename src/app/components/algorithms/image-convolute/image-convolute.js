import init, {
  image_convolute as rust_image_convolute,
} from "./libs/rust/pkg/image_convolute.js";
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

function jsImageConvolute(
  data,
  data2,
  width,
  height,
  weights,
  wwidth,
  wheight
) {
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
}

// fibonacci escrito en rust

let module,
  functions = {};
fetch("libs/cpp/imageConvolute.wasm")
  .then((response) => response.arrayBuffer())
  .then((buffer) => new Uint8Array(buffer))
  .then((binary) => {
    let moduleArgs = {
      wasmBinary: binary,
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
        console.log("cpp loaded");
        onReady();
      },
    };
    module = Module(moduleArgs);
  });

function start() {
  const image = document.getElementById("original_image");
  const width = image.width;
  const height = image.height;
  const loop = 10;
  const weights = new Float64Array([
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
  const wWidth = 5;
  const wHeight = 5;
  if (loop === 0) {
    document.getElementById("message").innerText =
      "Please input both number and loop";
  } else if (loop > 0) {
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

    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    let imageData = context.getImageData(0, 0, width, height);

    let jsCanvas = document.getElementById("js_canvas");
    jsCanvas.width = width;
    jsCanvas.height = height;
    let jsContext = jsCanvas.getContext("2d");
    let jsImageData = jsContext.getImageData(0, 0, width, height);

    let cwsCanvas = document.getElementById("cws_canvas");
    cwsCanvas.width = width;
    cwsCanvas.height = height;
    let cwsContext = cwsCanvas.getContext("2d");
    let cwsImageData = cwsContext.getImageData(0, 0, width, height);

    let rustwsCanvas = document.getElementById("rust_ws_canvas");
    rustwsCanvas.width = width;
    rustwsCanvas.height = height;
    let rustwsContext = rustwsCanvas.getContext("2d");
    let rustwsImageData = rustwsContext.getImageData(0, 0, width, height);

    let array0 = imageData.data;
    let array1 = jsImageData.data;
    let array2 = cwsImageData.data;
    let array3 = rustwsImageData.data;

    function equalArray(array1, array2) {
      if (array1.length !== array2.length) return false;
      for (let i = 0, il = array1.length; i < il; i++) {
        if (array1[i] !== array2[i]) return false;
      }
      return true;
    }

    function checkFunctionality() {
      jsImageConvolute(array0, array1, width, height, weights, wWidth, wHeight);
      cwsImageConvolute(
        array0,
        array2,
        width,
        height,
        weights,
        wWidth,
        wHeight
      );
      runRustWasm(array0, array3, width, height, weights, wWidth, wHeight);
      jsContext.putImageData(jsImageData, 0, 0);
      cwsContext.putImageData(cwsImageData, 0, 0);
      rustwsContext.putImageData(rustwsImageData, 0, 0);
      return equalArray(array1, array2) && equalArray(array1, array3);
    }

    function run(func, array, width, height, loop) {
      func(array0, array, width, height, weights, wWidth, wHeight); // warm-up
      let elapsedTime = 0.0;
      for (let i = 0; i < loop; i++) {
        let startTime = performance.now();
        func(array0, array, width, height, weights, wWidth, wHeight);
        let endTime = performance.now();
        elapsedTime += endTime - startTime;
      }
      return (elapsedTime / loop).toFixed(4);
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
      let pointer1 = module._malloc(array1.length);
      let pointer2 = module._malloc(array2.length);
      let pointer3 = module._malloc(weights.length * 8);
      let offset1 = pointer1;
      let offset2 = pointer2;
      let offset3 = pointer3 / 8;
      module.HEAPU8.set(array1, offset1);
      module.HEAPF64.set(weights, offset3);
      functions.imageConvolute(
        pointer1,
        pointer2,
        width,
        height,
        pointer3,
        wWidth,
        wHeight
      );
      array2.set(module.HEAPU8.subarray(offset2, offset2 + array2.length));
      module._free(pointer1);
      module._free(pointer2);
      module._free(pointer3);
    }

    function runRustWasm(
      data1,
      data2,
      width,
      height,
      weights,
      wWidth,
      wHeight
    ) {
      rust_image_convolute(
        data1,
        data2,
        width,
        height,
        weights,
        wWidth,
        wHeight
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
          jsImageConvolute,
          array1,
          width,
          height,
          loop
        );
        setTimeout(function() {
          cwsPerformance.innerText = run(
            cwsImageConvolute,
            array2,
            width,
            height,
            loop
          );
          setTimeout(function() {
            rustwsPerformance.innerText = run(
              rust_image_convolute,
              array3,
              width,
              height,
              loop
            );
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

if (document.querySelector("#foto")) {
  let foto = document.querySelector("#foto");
  foto.onchange = function(e) {
    let uploadFoto = document.querySelector("#foto").value;
    let nav = window.URL || window.webkitURL;
    let contactAlert = document.querySelector("#form_alert");
    if (uploadFoto != "") {
      contactAlert.innerHTML = "";
      if (document.querySelector("#original_image")) {
        document.querySelector("#original_image").remove();
      }
      document.querySelector(".delPhoto").classList.remove("notBlock");
      let objeto_url = nav.createObjectURL(this.files[0]);
      document.querySelector(".prevPhoto div").innerHTML =
        "<img id='original_image' src=" + objeto_url + ">";
    }
  };
}

if (document.querySelector(".delPhoto")) {
  let delPhoto = document.querySelector(".delPhoto");
  delPhoto.onclick = function(e) {
    removePhoto();
  };
}

function removePhoto() {
  document.querySelector("#foto").value = "";
  document.querySelector(".delPhoto").classList.add("notBlock");
  document.querySelector("#original_image").remove();
  const objeto_url = "../../../../assets/img/image2.jpg";
  document.querySelector(".prevPhoto div").innerHTML =
        "<img id='original_image' src=" + objeto_url + ">";
}
