const Navbar = () => {
  const view = /*html*/ `
  <nav class="nav__container">
    <div>
      <a
        href="https://webassembly.org/"
        target="_blank"
        class="nav__link nav__logo"
      >
        W <span class="nav__logo-name">ebAssembly</span>
      </a>
      <div class="nav__list">
        <div class="nav__items">
          <h3 class="nav__subtitle">Algorithms</h3>
          <!-- collision detection -->
          <a 
            class="nav__link" 
            href="#/collision-detection">
            <i class="bx bx-cross nav__icon"></i>
            <span class="nav__name">Collision Detection</span>
          </a>
          <!-- fibonacci -->
          <a
            class="nav__link active"
            href="#/fibonacci"
          >
            <i class="bx bxl-graphql nav__icon"></i>
            <span class="nav__name">Fibonacci</span>
          </a>
          <!-- multiply Double -->
          <a 
            class="nav__link"
            href="#/multiply-double"
            >
            <i class="bx bx-calculator nav__icon"></i>
            <span class="nav__name">Multiply Double</span>
          </a>
          <!-- multiply Int Vector -->
          <a 
            class="nav__link"
            href="#/multiply-int-vector"
            >
            <i class="bx bx-vector nav__icon"></i>
            <span class="nav__name">Multiply Int Vector</span>
          </a>
          <!-- multiply Double Vector -->
          <a 
            class="nav__link"
            href="#/multiply-double-vector"
            >
            <i class="bx bx-vector nav__icon"></i>
            <span class="nav__name">Multiply Double Vector</span>
          </a>
          <!-- QuickSort Int -->
          <a 
            class="nav__link"
            href="#/quicksort-int"
            >
            <i class="bx bx-sort-up nav__icon"></i>
            <span class="nav__name">QuickSort Int</span>
          </a>
          <!-- QuickSort Double -->
          <a 
            class="nav__link"
            href="#/quicksort-double"
            >
            <i class="bx bx-sort-up nav__icon"></i>
            <span class="nav__name">QuickSort Double</span>
          </a>
          <!-- sum int -->
          <a
            class="nav__link active"
            href="#/sum-int"
            >
            <i class="bx bx-add-to-queue nav__icon"></i>
            <span class="nav__name">Sum Int</span>
          </a>
          <!-- sum double -->
          <a
            class="nav__link active"
            href="#/sum-double"
            >
            <i class="bx bx-add-to-queue nav__icon"></i>
            <span class="nav__name">Sum Double</span>
          </a>
          <!-- Image convolute -->
          <a
            class="nav__link active"
            href="#/image-convolute"
            >
            <i class="bx bx-image-alt nav__icon"></i>
            <span class="nav__name">Image Convolute</span>
          </a>
          <!-- Video convolute -->
          <a
            class="nav__link active"
            href="#/video-convolute"
            >
            <i class="bx bx-image-alt nav__icon"></i>
            <span class="nav__name">Video Convolute</span>
          </a>
          <!-- suma consecutiva -->
          <a
            class="nav__link active"
            href="#/sum-consecutiva"
          >
            <i class="bx bx-add-to-queue nav__icon"></i>
            <span class="nav__name">Consecutive Add</span>
          </a>
          <!-- Ray tracer -->
          <a
            class="nav__link"
            href="https://rockycott.github.io/wasm-rust-raytracer-js/"
            target="_blank"
            >
            <i class="bx bx-leaf nav__icon"></i>
            <span class="nav__name">RayTracer</span>
          </a>
        </div>
      </div>
    </div>
    <a
      href="https://github.com/RockyCott"
      target="_blank"
      class="nav__link nav__logout"
    >
      <i class="bx bxl-github nav__icon"></i>
      <span class="nav__name">RockyCott</span>
    </a>
  </nav>
  `;
  return view;
};

export default Navbar;
