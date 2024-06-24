import router from "./routes/index.routes";

// Inicializa la aplicación SPA
// Este evento se dispara cuando la ventana se ha cargado por completo
window.addEventListener("load", () => {
  try {
    // Llama a la función router para renderizar el contenido inicial
    router();
  } catch (error) {
    // Manejo de errores al cargar la ruta inicial
    console.error("Error loading initial route:", error);
  }
});

// Detecta cambios en la URL (hashchange)
// Este evento se dispara cuando la parte después del # en la URL cambia
window.addEventListener("hashchange", () => {
  try {
    // Llama a la función router para renderizar el contenido correspondiente a la nueva ruta
    router();
  } catch (error) {
    // Manejo de errores al cambiar la ruta
    console.error("Error changing route:", error);
  }
});