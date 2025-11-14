import './components/youtubeEmbed.js'
import { Router } from "./services/Router.js";
import './components/animatedLoading.js'

window.addEventListener("DOMContentLoaded", event => {
  window.app.router.init();
})

window.app = {
  search: (event: Event) => {
    event.preventDefault();
    const input = document.querySelector<HTMLInputElement>("input[type=search]");
    window.app.router.go("/movies?q=" + input!.value)
  },
  router: Router,
  showError: (message = "There was an error.", goToHome = true) => {
    (document.getElementById("alert-modal") as HTMLDialogElement).showModal();
    (document.querySelector("#alert-modal p") as HTMLElement).textContent = message;
    if (goToHome) window.app.router.go("/")
  },
  closeError: () => {
    (document.getElementById("alert-modal") as HTMLDialogElement).close();
  },
  searchOrderChange: (order: any) => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get("q");
    const genre = urlParams.get("genre") ?? "";
    window.app.router.go(`/movies?q=${q}&order=${order}&genre=${genre}`);
  },
  searchFilterChange: (genre: any) => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get("q");
    const order = urlParams.get("order") ?? "";
    window.app.router.go(`/movies?q=${q}&order=${order}&genre=${genre}`);
  }
}
