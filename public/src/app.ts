import { HomePage } from "./components/homepage.js";


window.addEventListener("DOMContentLoaded", event => {
  document.querySelector("main")?.appendChild(new HomePage)
})

window.app = {
  search: (event: Event) => {
    event.preventDefault();

    const input = document.querySelector<HTMLInputElement>("input[type=search]");
    const q = input?.value ?? "";

    console.log("Search query:", q);
  },
}
