function init() {
  const boton = document.getElementById("run_button");
  boton.addEventListener("click", start);
}

// esperar a que cargue el body
document.addEventListener("DOMContentLoaded", init);

function jsFib(n) {
  if (n === 1) return 1;
  if (n === 2) return 1;
  return jsFib(n - 1) + jsFib(n - 2);
}

let module,
  functions = {};
fetch("fib.wasm")
  .then((response) => response.arrayBuffer())
  .then((buffer) => new Uint8Array(buffer))
  .then((binary) => {
    let moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: function() {
        functions.fib = module.cwrap("fib", "number", ["number"]);
        onReady();
      },
    };
    module = Module(moduleArgs);
  });

function start() {
  document.getElementById("run_button").disabled = true;

  let num = 0x28;
  let loop = 10;

  let jsPerformance = document.getElementById("js_performance");
  let wsPerformance = document.getElementById("ws_performance");
  let comparison = document.getElementById("comparison");

  jsPerformance.innerText = "";
  wsPerformance.innerText = "";
  comparison.innerText = "";

  function checkFunctionality(n) {
    return jsFib(n) === functions.fib(n);
  }

  function run(func, n, loop) {
    func(n); // warm-up
    let startTime = performance.now();
    for (let i = 0; i < loop; i++) {
      func(n);
    }
    let endTime = performance.now();
    return ((endTime - startTime) / loop).toFixed(4);
  }

  // don't use Promise for the non Promise support browsers so far.
  setTimeout(function() {
    if (!checkFunctionality(num)) {
      document.getElementById("message").innerText =
        "Two functions seem not equeal";
      document.getElementById("run_button").disabled = false;
      return;
    }
    setTimeout(function() {
      jsPerformance.innerText = run(jsFib, num, loop);
      setTimeout(function() {
        wsPerformance.innerText = run(functions.fib, num, loop);
        comparison.innerText = (
          Number(jsPerformance.innerText) / Number(wsPerformance.innerText)
        ).toFixed(4);
        document.getElementById("message").innerText = "Done";
        document.getElementById("run_button").disabled = false;
      });
      document.getElementById("message").innerText = "Running WebAssembly";
    });
    document.getElementById("message").innerText = "Running JavaScript";
  });

  document.getElementById("message").innerText = "Checking equality";
}

function onReady() {
  document.getElementById("run_button").disabled = false;
  document.getElementById("message").innerText = "Ready";
}

// function init() {
//   // putCode("test_code_area", document.getElementById("test_code").text.trim());
//   // putCode("js_code_area", document.getElementById("js_code").text.trim());

//   // loadTextFile("fib.c", function(text) {
//   //   putCode("ws_code_area", text.trim());
//   // });

//   // loadTextFile("fib.sh", function(text) {
//   //   putCode("sh_code_area", text.trim());
//   // });

//   // putCode(
//   //   "ws_instantiate_code_area",
//   //   document.getElementById("ws_instantiate_code").text.trim()
//   // );
// }

function loadTextFile(url, callback) {
  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.responseType = "text";
  request.onload = function(event) {
    callback(request.response);
  };
  request.send();
}

function putCode(textareaId, code) {
  let textarea = document.getElementById(textareaId);
  textarea.value = code;
  textarea.setAttribute("rows", code.split("\n").length);
}

function switchDisplay(div) {
  let textarea = div.getElementsByTagName("textarea")[0];
  let p = div.getElementsByTagName("p")[0];
  p.textContent = p.textContent.slice(2);
  if (textarea.style.display === "none") {
    textarea.style.display = "";
    p.textContent = "- " + p.textContent;
  } else {
    textarea.style.display = "none";
    p.textContent = "+ " + p.textContent;
  }
}
