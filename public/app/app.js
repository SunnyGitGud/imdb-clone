import './components/youtubeEmbed.js';
import { Router } from "./services/Router.js";
import './components/animatedLoading.js';
import { API } from './services/api.js';
window.addEventListener("DOMContentLoaded", event => {
    window.app.router.init();
});
window.app = {
    search: (event) => {
        event.preventDefault();
        const input = document.querySelector("input[type=search]");
        window.app.router.go("/movies?q=" + input.value);
    },
    router: Router,
    showError: (message = "There was an error.", goToHome = false) => {
        document.getElementById("alert-modal").showModal();
        document.querySelector("#alert-modal p").textContent = message;
        if (goToHome)
            window.app.router.go("/");
    },
    closeError: () => {
        document.getElementById("alert-modal").close();
    },
    searchOrderChange: (order) => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const genre = urlParams.get("genre") ?? "";
        window.app.router.go(`/movies?q=${q}&order=${order}&genre=${genre}`);
    },
    searchFilterChange: (genre) => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const order = urlParams.get("order") ?? "";
        window.app.router.go(`/movies?q=${q}&order=${order}&genre=${genre}`);
    },
    register: async (event) => {
        event.preventDefault();
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const passwordConfirm = document.getElementById("register-password-confirmation").value;
        const errors = [];
        if (name.length < 4)
            errors.push("Enter Your complete name.");
        if (password.length < 7)
            errors.push("Enter A password with at least 7 characters.");
        if (email.length < 4)
            errors.push("Enter Your complete email.");
        if (password != passwordConfirm)
            errors.push("Passwords don't match.");
        if (errors.length == 0) {
            const resp = await API.register(name, email, password);
            if (resp.success) {
                window.app.router.go("/account/");
            }
            else {
                window.app.showError(resp.message);
            }
        }
        else {
            window.app.showError(errors.join(" "));
        }
    },
    login: async (event) => {
        event.preventDefault();
        let errors = [];
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        if (email.length < 8)
            errors.push("Enter your complete email");
        if (password.length < 6)
            errors.push("Enter a password with 6 characters");
        if (errors.length == 0) {
            const response = await API.login(email, password);
            if (response.success) {
                window.app.router.go("/account/");
            }
            else {
                window.app.showError(response.message, false);
            }
        }
        else {
            window.app.showError(errors.join(". "), false);
        }
    }
};
