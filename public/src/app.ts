import { AnimatedLoading } from "./components/animatedLoading.js";
import { HomePage } from "./components/homepage.js";
import { MovieDetailsPage } from "./components/movieDetailsPage.js";
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
  router: Router
}
