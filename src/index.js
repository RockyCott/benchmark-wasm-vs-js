const Mostrarmenu = (headerToggle, navbarId) => {
  const toggleBtn = document.getElementById(headerToggle);
  const nav = document.getElementById(navbarId);
  if (headerToggle && navbarId && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      toggleBtn.classList.toggle("bx-x");
    });
  }
};
Mostrarmenu("header-toggle", "navbar");

const linkcolor = document.querySelectorAll(".nav__link");
function colorLink() {
  linkcolor.forEach(item => item.classList.remove("active"));
  this.classList?.add("active");
}
linkcolor.forEach(item => item.addEventListener("click", colorLink));

function main() {
  this.colorLink();
}

main();

let last_html = "";
let last_css = "";
let last_js = "";

// objeto con las rutas de los archivos
const file_paths = Object.freeze({
  mathOperations: {
    html: "app/components/algorithms/math-operations/math-operations.html",
    //css: "tests/algorithms/math-operations/math-operations.css",
    js: "app/components/algorithms/math-operations/math-operations.js"
  },
  collisionDetection: {
    html: "tests/algorithms/collision-detection/collision-detection.html",
    css: "tests/algorithms/collision-detection/collision-detection.css",
    js: "tests/algorithms/collision-detection/collision-detection.js"
  },
  about: {
    html: "about.html",
    css: "about.css",
    js: "about.js"
  }
});

function cargarContenido(file_path) {
  // obtener las rutas de los archivos
  const urlHTML = file_paths[file_path]?.html;
  const urlCSS = file_paths[file_path]?.css ?? "";
  const urlJS = file_paths[file_path]?.js ?? "";

  if (urlHTML === undefined) {
    // mostrar error
    console.error("No se encontró la ruta del archivo HTML");
    return;
  }
  // validar que los archivos no sean los mismos
  if (last_html === urlHTML && last_css === urlCSS && last_js === urlJS) {
    return;
  }
  const contenidoDiv = document.getElementById("contenido");

  // Realizar una solicitud AJAX para obtener el contenido del archivo HTML externo
  const xhrHTML = new XMLHttpRequest();
  xhrHTML.open("GET", urlHTML, true);
  xhrHTML.onreadystatechange = function() {
    if (xhrHTML.readyState === 4 && xhrHTML.status === 200) {
      // Reemplazar el contenido actual con el contenido del archivo HTML externo
      contenidoDiv.innerHTML = xhrHTML.responseText;

      if (urlCSS !== "") {
        // Cargar el archivo CSS correspondiente
        const linkCSS = document.createElement("link");
        linkCSS.rel = "stylesheet";
        linkCSS.href = urlCSS;
        document.head.appendChild(linkCSS);
      }
    } else {
      // Manejar errores si es necesario
      contenidoDiv.innerHTML = `
        <h2>Error al cargar el contenido</h2>
        <p>No se pudo cargar el contenido solicitado.</p>
      `;
    }
  };
  xhrHTML?.send();

  // eliminar el script que tenga la misma ruta
  const script = document.querySelector('script[src="' + urlJS + '"]');
  script?.remove();

  // Cargar el archivo JavaScript correspondiente
  if (urlJS !== "") {
    const scriptJS = document.createElement("script");
    scriptJS.type = "module";
    scriptJS.src = urlJS;
    document.body.appendChild(scriptJS);
  }

  // guardar las rutas de los archivos
  last_html = urlHTML;
  last_css = urlCSS;
  last_js = urlJS;
}
