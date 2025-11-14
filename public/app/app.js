import './components/youtubeEmbed.js';
import { Router } from "./services/Router.js";
import './components/animatedLoading.js';
window.addEventListener("DOMContentLoaded", event => {
    window.app.router.init();
});
window.app = {
    search: (event) => {
        event.preventDefault();
        const input = document.querySelector("input[type=search]");
        const q = input?.value ?? "";
        console.log("Search query:", q);
    },
    router: Router
};
