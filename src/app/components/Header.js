const Header = () => {
  const view = /*html*/`
    <div class="header__container">
      <a
        href="https://github.com/RockyCott"
        target="_blank"
        class="header__img"
      >
        <img
          src="assets/images/avatar.jpg"
          class="header__img cursor-pointer"
          alt="imagen de perfil"
        />
      </a>
      <div class="header__search">
        <input
          type="search"
          placeholder="Donde están las gatas"
          class="header__input"
        />
        <i class="bx bx-search"></i>
      </div>
      <div class="header__toggle">
        <i class="bx bx-menu" id="header-toggle"></i>
      </div>
    </div>
  `;
  return view;
};

export default Header;
