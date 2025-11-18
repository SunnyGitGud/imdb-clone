import { API } from "../services/api.js"
import { MovieItemComponent } from "./movieItemComponent.js"

export class ActorsDetailsPage extends HTMLElement {
  params!: string[];
  id: any
  actor: any
  moviesByActor: any

  async render() {
    try {
      this.moviesByActor = await API.getMovieByActorsId(this.id)
    } catch {
      window.app.showError("Actor ID Invalid")
      return;
    }

    if (!this.moviesByActor || this.moviesByActor.length === 0) {
      window.app.showError("Actor not found");
      return;
    }

    const actorData = this.moviesByActor[0];
    const template = document.getElementById("template-actor-details") as HTMLTemplateElement
    const content = template.content.cloneNode(true)
    this.appendChild(content)

    this.querySelector("#actor-image")!.setAttribute(
      "src",
      actorData.image_url.String
    );
    this.querySelector("h2")!.textContent =
      `${actorData.first_name} ${actorData.last_name}`;

    // Fill movie list
    const ul = this.querySelector("#movies-result")!;
    ul.innerHTML = "";

    this.moviesByActor.forEach((movie: any) => {
      const movieData = {
        ID: movie.movie_id,
        Title: movie.title,
        PosterUrl: movie.poster_url,
        ReleaseYear: movie.release_year
      };

      const li = document.createElement("li");
      const movieItem = new MovieItemComponent(movieData);
      li.appendChild(movieItem);
      ul.appendChild(li);
    });
  }

  connectedCallback() {
    this.id = this.params[0]
    this.render()
  }
}
customElements.define("actors-page", ActorsDetailsPage)

