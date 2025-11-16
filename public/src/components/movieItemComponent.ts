export class MovieItemComponent extends HTMLElement {
  movie: any;
  showRemoveButton: boolean;
  onRemove?: (movie: any) => void;

  constructor(movie: any, showRemoveButton: boolean = false, onRemove?: (movie: any) => void) {
    super();
    this.movie = movie;
    this.showRemoveButton = showRemoveButton;
    this.onRemove = onRemove;
  }

  connectedCallback() {
    const url = "/movies/" + this.movie.ID;
    this.innerHTML = `
<a href="${url}" onclick="event.preventDefault(); app.router.go('${url}')" class="movie-item-link">
  <article class="movie-item-article">
    <div class="movie-poster-container">
      <img src="${this.movie.PosterUrl.String}" alt="${this.movie.Title} Poster">
      ${this.showRemoveButton ? '<button class="remove-btn-overlay">&times;</button>' : ''}
    </div>
    <p>${this.movie.Title} (${this.movie.ReleaseYear.Int32})</p>
  </article>
</a>`;

    if (this.showRemoveButton && this.onRemove) {
      const removeBtn = this.querySelector('.remove-btn-overlay') as HTMLButtonElement;
      if (removeBtn) {
        removeBtn.onclick = async (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.onRemove!(this.movie);
        };
      }
    }
  }
}

customElements.define("movie-item", MovieItemComponent);
