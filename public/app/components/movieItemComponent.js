export class MovieItemComponent extends HTMLElement {
    movie;
    constructor(movie) {
        super();
        this.movie = movie;
    }
    connectedCallback() {
        this.innerHTML = `
<a href="#">
<article>
<img src="${this.movie.PosterUrl.String}" alt="${this.movie.Title} Poster">
<p>${this.movie.Title} (${this.movie.ReleaseYear})</p>
</article>
</a>
`;
    }
}
customElements.define("movie-item", MovieItemComponent);
