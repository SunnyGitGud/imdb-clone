export class MovieItemComponent extends HTMLElement {
  movie: any
  constructor(movie: any) {
    super();
    this.movie = movie
  }
  connectedCallback() {
    this.innerHTML = `
<a href="#">
<article>
<img src="${this.movie.PosterUrl.String}" alt="${this.movie.Title} Poster">
<p>${this.movie.Title} (${this.movie.ReleaseYear.Int32})</p>
</article>
</a>
`;
  }
}

customElements.define("movie-item", MovieItemComponent)
