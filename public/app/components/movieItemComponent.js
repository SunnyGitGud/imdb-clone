export class MovieItemComponent extends HTMLElement {
    movie;
    constructor(movie) {
        super();
        this.movie = movie;
    }
    connectedCallback() {
        const url = "/movies/" + this.movie.ID;
        this.innerHTML = `
<a href="${url}" onclick="event.preventDefault(); app.router.go('${url}')">
  <article>
    <img src="${this.movie.PosterUrl.String}" alt="${this.movie.Title} Poster">
    <p>${this.movie.Title} (${this.movie.ReleaseYear.Int32})</p>
  </article>
</a>`;
    }
}
customElements.define("movie-item", MovieItemComponent);
