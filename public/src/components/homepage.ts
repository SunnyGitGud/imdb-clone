import { API } from "../services/api.js";

export class HomePage extends HTMLElement {

  async render() {
    const topList = document.querySelector<HTMLElement>("#top-10 ul");
    const randomList = document.querySelector<HTMLElement>("#random ul");

    if (!topList || !randomList) {
      console.warn("List elements not found on page");
      return;
    }

    try {
      const topMovies = await API.getTopMovies();
      renderMoviesInList(topMovies, topList);

      const topRandom = await API.getRandomMovies();
      renderMoviesInList(topRandom, randomList);
    } catch (e) {
      console.error("Error rendering movies:", e);
    }
    function renderMoviesInList(movies: any, ul: HTMLElement) {
      ul.innerHTML = ""
      for (const movie of movies) {
        const li = document.createElement("li");
        li.textContent = movie.Title
        ul.appendChild(li);
      }
    }
  }
  connectedCallback() {
    const template = document.getElementById("template-home") as HTMLTemplateElement;
    const content = template?.content.cloneNode(true) as Node
    this.appendChild(content);
    this.render()
  }
}
customElements.define("home-page", HomePage);
