import { HomePage } from "./components/homepage.js";
window.addEventListener("DOMContentLoaded", event => {
    document.querySelector("main")?.appendChild(new HomePage);
});
window.app = {
    search: (event) => {
        event.preventDefault();
        const input = document.querySelector("input[type=search]");
        const q = input?.value ?? "";
        console.log("Search query:", q);
    },
};
