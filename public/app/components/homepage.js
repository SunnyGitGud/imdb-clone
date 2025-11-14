import { API } from "../services/api.js";
import { MovieItemComponent } from "./movieItemComponent.js";
export class HomePage extends HTMLElement {
    async render() {
        const topList = document.querySelector("#top-10 ul");
        const randomList = document.querySelector("#random ul");
        if (!topList || !randomList) {
            console.warn("List elements not found on page");
            return;
        }
        try {
            const topMovies = await API.getTopMovies();
            renderMoviesInList(topMovies, topList);
            const topRandom = await API.getRandomMovies();
            renderMoviesInList(topRandom, randomList);
        }
        catch (e) {
            console.error("Error rendering movies:", e);
        }
        function renderMoviesInList(movies, ul) {
            ul.innerHTML = "";
            for (const movie of movies) {
                const li = document.createElement("li");
                li.appendChild(new MovieItemComponent(movie));
                ul.appendChild(li);
            }
        }
    }
    connectedCallback() {
        const template = document.getElementById("template-home");
        const content = template?.content.cloneNode(true);
        this.appendChild(content);
        this.render();
    }
}
customElements.define("home-page", HomePage);
