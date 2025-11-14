import { AnimatedLoading } from "./components/animatedLoading.js";
import { HomePage } from "./components/homepage.js";
import { MovieDetailsPage } from "./components/movieDetailsPage.js";
import './components/youtubeEmbed.js';
window.addEventListener("DOMContentLoaded", event => {
    document.querySelector("main")?.appendChild(new AnimatedLoading);
});
window.addEventListener("DOMContentLoaded", event => {
    document.querySelector("main")?.appendChild(new HomePage);
});
window.addEventListener("DOMContentLoaded", event => {
    document.querySelector("main")?.appendChild(new MovieDetailsPage);
});
window.app = {
    search: (event) => {
        event.preventDefault();
        const input = document.querySelector("input[type=search]");
        const q = input?.value ?? "";
        console.log("Search query:", q);
    },
};
