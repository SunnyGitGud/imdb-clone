import { MovieItemComponent } from "./movieItemComponent.js";
export class CollectionPage extends HTMLElement {
    endpoint;
    title;
    collectionType;
    constructor(endpoint, title, collectionType) {
        super();
        this.endpoint = endpoint;
        this.title = title;
        this.collectionType = collectionType;
    }
    async render() {
        const movies = await this.endpoint();
        const ulMovies = this.querySelector("ul");
        ulMovies.innerHTML = "";
        if (movies && movies.length > 0) {
            movies.forEach((movie) => {
                const li = document.createElement("li");
                li.classList.add("collection-item");
                const item = new MovieItemComponent(movie, true, // showRemoveButton
                (movie) => {
                    window.app.deleteFromCollection(movie.ID, this.collectionType);
                });
                li.appendChild(item);
                ulMovies.appendChild(li);
            });
        }
        else {
            ulMovies.innerHTML = "<h3>There are no movies</h3>";
        }
    }
    connectedCallback() {
        const template = document.getElementById("template-collection");
        const content = template.content.cloneNode(true);
        this.appendChild(content);
        this.render();
    }
}
