const About = () => {
  const view = /*html*/`
      <div class="about">
        <h1>About</h1>
        <p>
            This is a simple SPA (Single Page Application) built with vanilla JavaScript.
            It uses Rick and Morty API to display information about the characters.
        </p>
        <p>
            You can find the source code in this
            <a href="#">link</a>.
        </p>
      </div>
    `;
  return view;
};

export default About;
