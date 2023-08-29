import init, {
  collision_detection as rust_collision_detection,
} from "./libs/rust/pkg/collision_detection.js";
let rust_load = false;
let cpp_load = false;
function ngInit() {
  const boton = document.getElementById("run_button");
  boton.addEventListener("click", start);
}

async function rustLoad() {
  await init();
  rust_load = true;
  console.log("rust loaded");
  onReady();
}
rustLoad();

// esperar a que cargue el body
document.addEventListener("DOMContentLoaded", ngInit);

function jsCollisionDetection(positions, radiuses, res, n) {
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
}

// fibonacci escrito en rust

let module,
  functions = {};
fetch("libs/cpp/collisionDetection.wasm")
  .then((response) => response.arrayBuffer())
  .then((buffer) => new Uint8Array(buffer))
  .then((binary) => {
    let moduleArgs = {
      wasmBinary: binary,
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
  });

function start() {
  // obtener el valor del input
  let warm_up_loops = document.getElementById("stacked-number").value;
  // convertir a numero
  warm_up_loops = Number(warm_up_loops);
  let loop = document.getElementById("stacked-loops").value;
  loop = Number(loop);
  let elemNum = 0x4000;

  if (warm_up_loops === 0 || loop === 0) {
    document.getElementById("message").innerText =
      "Please input both number and loop";
  } else if (warm_up_loops > 0 && loop > 0) {
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
