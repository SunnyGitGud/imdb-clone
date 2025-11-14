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
    const q = input?.value ?? "";

    console.log("Search query:", q);
  },
  router: Router,
  showError: (message = "There was an error.", goToHome = true) => {
    (document.getElementById("alert-modal") as HTMLDialogElement).showModal();
    (document.querySelector("#alert-modal p") as HTMLElement).textContent = message;
    if (goToHome) window.app.router.go("/")
  },
  closeError: () => {
    (document.getElementById("alert-modal") as HTMLDialogElement).close();
  }
}
