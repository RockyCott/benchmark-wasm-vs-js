// pages
import Error404 from "../pages/Error-404";

// components
import Header from "../components/Header";
import Navbar from "../components/Navbar";

import getHash from "../utils/getHash";
import resolveRoutes from "../utils/resolveRoutes";
import routes from "./routes";

const router = async () => {
  const header = document.getElementById("header");
  const navbar = document.getElementById("navbar");
  const content = document.getElementById("content");
  if (header) {
    header.innerHTML = await Header();
  }

  if (navbar) {
    navbar.innerHTML = await Navbar();
  }
  let hash = getHash();
  let hashRoute = await resolveRoutes(hash);
  let render = Error404;
  // Obtener el componente correspondiente a la ruta
  for (const route of routes) {
    if (route.path === hashRoute) {
      render = route.component;
      break;
    }
  }

  // content es el id de la etiqueta donde se renderizará el contenido
  content.innerHTML = await render();
};

export default router;
