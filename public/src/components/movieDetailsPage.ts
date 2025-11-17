import { API } from "../services/api.js"

export class MovieDetailsPage extends HTMLElement {
  params!: string[];
  id: any
  movie: any
  async render() {
    try {
      this.movie = await API.getMovieById(this.id);
    } catch (e) {
      window.app.showError("Movie ID Invalid")
      return;
    }
    await API.getUserMovieRelation(this.id)
    const template = document.getElementById("template-movie-details") as HTMLTemplateElement;
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    (this.querySelector("h2") as HTMLHeadingElement).textContent = this.movie.Title;
    (this.querySelector("h3") as HTMLHeadingElement).textContent = this.movie.Tagline?.String || '';
    (this.querySelector("#trailer") as HTMLElement).dataset.url = this.movie.TrailerUrl?.String || '';

    const img = this.querySelector("img") as HTMLImageElement;
    img.src = this.movie.PosterUrl?.String || '';
    img.alt = `${this.movie.Title} Poster`;

    this.querySelector("#overview")!.textContent = this.movie.Overview?.String || '';

    this.querySelector("#metadata")!.innerHTML = `
    <dt>Release Year</dt>
    <dd>${this.movie.ReleaseYear?.Int32 || 'N/A'}</dd>
    <dt>Score</dt>
    <dd>${this.movie.Score?.Float64?.toFixed(1) || 'N/A'} / 10</dd>
    <dt>Popularity</dt>
    <dd>${this.movie.Popularity?.Float64?.toFixed(1) || 'N/A'}</dd>
  `;
    const ulGenres = this.querySelector("#genres") as HTMLUListElement;
    ulGenres.innerHTML = "";
    this.movie.Genres?.forEach((genre: any) => {
      const li = document.createElement("li");
      li.textContent = genre.Name || genre.name;
      ulGenres.appendChild(li);
    });
    this.querySelector("#actions #btnFavorites")?.addEventListener("click", () => {
      window.app.saveToCollection(this.movie.ID, "favorite")
    })
    this.querySelector("#actions #btnWatchlist")?.addEventListener("click", () => {
      window.app.saveToCollection(this.movie.ID, "watchlist")
    })
    const ulCast = this.querySelector("#cast") as HTMLUListElement;
    ulCast.innerHTML = "";
    this.movie.Actors?.forEach((actor: any) => {
      const li = document.createElement("li");
      const imageUrl = actor.ImageUrl?.String || actor.image_url || '/images/generic_actor.jpg';
      const firstName = actor.FirstName || actor.first_name || '';
      const lastName = actor.LastName || actor.last_name || '';

      li.innerHTML = `
    <img src="${imageUrl}" alt="Picture of ${lastName}">
    <p>${firstName} ${lastName}</p>
  `;
      ulCast.appendChild(li);
    });
  }

  connectedCallback() {
    this.id = this.params[0]
    this.render()
  }
}

customElements.define("movie-details-page", MovieDetailsPage)
