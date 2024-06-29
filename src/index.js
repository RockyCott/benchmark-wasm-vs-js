import "./app/app";

const Mostrarmenu = (headerToggle, navbarId) => {
  const toggleBtn = document.getElementById(headerToggle);
  const nav = document.getElementById(navbarId);
  if (headerToggle && navbarId && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
      //toggleBtn.classList.toggle("bx-x");
    });
  }
};

function colorLink() {
  const linkcolor = document.querySelectorAll(".nav__link");
  if (linkcolor) {
    linkcolor.forEach((item) => item.addEventListener("click", colorLink));
    linkcolor.forEach((item) => item.classList.remove("active"));
  }
  document.querySelector(".nav__link")?.classList?.add("active");
}

window.addEventListener("load", () => {
  Mostrarmenu("header-toggle", "navbar");
  colorLink();
});

window.addEventListener("hashchange", () => {
  Mostrarmenu("header-toggle", "navbar");
  colorLink();
});