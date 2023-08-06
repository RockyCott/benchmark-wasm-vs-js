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
  linkcolor.forEach((item) => item.classList.remove("active"));
  this.classList?.add("active");
}
linkcolor.forEach((item) => item.addEventListener("click", colorLink));

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
  },
  collisionDetection: {
    html:
      "app/components/algorithms/collision-detection/collision-detection.html",
  },
  fibonacci: {
    html: "app/components/algorithms/fibonacci/fibonacci.html",
  },
});

function cargar_contenido(file_path) {
  // obtener las rutas de los archivos
  const urlHTML = file_paths[file_path]?.html;
  if (urlHTML === undefined) {
    // mostrar error
    console.error("No se encontró la ruta del archivo HTML");
    return;
  }
  // validar que el path no se ha cargado antes
  if (last_html === urlHTML) {
    return;
  }
  const embed = document.getElementById("embed");
  if (embed) {
    embed.src = urlHTML;
    //embed.src = "app/components/not-found/not-found.html";
  }
}

// esta funcion comentada era para cargar el contenido de los archivos html, css y js en algo similar a SPA
// function cargarContenido(file_path) {
//   // obtener las rutas de los archivos
//   const urlHTML = file_paths[file_path]?.html;
//   const urlCSS = file_paths[file_path]?.css ?? "";
//   const urlJS = file_paths[file_path]?.js ?? "";

//   if (urlHTML === undefined) {
//     // mostrar error
//     console.error("No se encontró la ruta del archivo HTML");
//     return;
//   }
//   // validar que los archivos no sean los mismos
//   if (last_html === urlHTML && last_css === urlCSS && last_js === urlJS) {
//     return;
//   }
//   const contenidoDiv = document.getElementById("contenido");

//   // Realizar una solicitud AJAX para obtener el contenido del archivo HTML externo
//   const xhrHTML = new XMLHttpRequest();
//   xhrHTML.open("GET", urlHTML, true);
//   xhrHTML.onreadystatechange = function() {
//     if (xhrHTML.readyState === 4 && xhrHTML.status === 200) {
//       // Reemplazar el contenido actual con el contenido del archivo HTML externo
//       contenidoDiv.innerHTML = xhrHTML.responseText;

//       // eliminar el css que tenga la misma ruta
//       const link = document.querySelector('link[href="' + urlCSS + '"]');
//       link?.remove();

//       // eliminar el ultimo css
//       const linkLast = document.querySelector('link[href="' + last_css + '"]');
//       linkLast?.remove();

//       if (urlCSS !== "") {
//         // Cargar el archivo CSS correspondiente
//         const linkCSS = document.createElement("link");
//         linkCSS.rel = "stylesheet";
//         linkCSS.href = urlCSS;
//         document.head.appendChild(linkCSS);
//       }
//     } else {
//       // Manejar errores si es necesario
//       contenidoDiv.innerHTML = `
//         <h2>Error al cargar el contenido</h2>
//         <p>No se pudo cargar el contenido solicitado.</p>
//       `;
//     }
//   };
//   xhrHTML?.send();

//   // eliminar el script que tenga la misma ruta
//   const script = document.querySelector('script[src="' + urlJS + '"]');
//   script?.remove();

//   // eliminar el ultimo script
//   const scriptLast = document.querySelector('script[src="' + last_js + '"]');
//   scriptLast?.remove();

//   // Cargar el archivo JavaScript correspondiente
//   if (urlJS !== "") {
//     const scriptJS = document.createElement("script");
//     scriptJS.type = "module";
//     scriptJS.src = urlJS;

//     // Fire the loading
//     document.body.appendChild(script);
//   }

//   // guardar las rutas de los archivos
//   last_html = urlHTML;
//   last_css = urlCSS;
//   last_js = urlJS;
// }
