import './components/youtubeEmbed.js'
import { Router } from "./services/Router.js";
import './components/animatedLoading.js'
import { API } from './services/api.js';
import proxiedStore from './services/store.js';
import './components/accountPage.js'

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
  store: proxiedStore,
  API: API,
  showError: (message = "There was an error.", goToHome = false) => {
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
  },
  register: async (event) => {
    event.preventDefault()
    const name = (document.getElementById("register-name") as HTMLInputElement)!.value
    const email = (document.getElementById("register-email") as HTMLInputElement)!.value
    const password = (document.getElementById("register-password") as HTMLInputElement)!.value
    const passwordConfirm = (document.getElementById("register-password-confirmation") as HTMLInputElement)!.value
    const errors: string[] = [];
    if (name.length < 4) errors.push("Enter Your complete name.");
    if (password.length < 7) errors.push("Enter A password with at least 7 characters.");
    if (email.length < 4) errors.push("Enter Your complete email.");
    if (password != passwordConfirm) errors.push("Passwords don't match.")

    if (errors.length == 0) {
      const resp = await API.register(name, email, password)
      if (resp.success) {
        window.app.store.jwt = resp.jwt
        window.app.router.go("/account/")
      } else {
        window.app.showError(resp.message)
      }
    } else {
      window.app.showError(errors.join(" "))
    }
  },
  login: async (event) => {
    event.preventDefault();
    let errors = [];

    const email = (document.getElementById("login-email") as HTMLInputElement)!.value
    const password = (document.getElementById("login-password") as HTMLInputElement)!.value
    if (email.length < 8) errors.push("Enter your complete email");
    if (password.length < 6) errors.push("Enter a password with 6 characters");
    if (errors.length == 0) {
      const response = await API.login(email, password);
      if (response.success) {
        window.app.store.jwt = response.jwt
        window.app.router.go("/account/")
      } else {
        window.app.showError(response.message, false);
      }
    } else {
      window.app.showError(errors.join(". "), false);
    }
  },
  logout: () => {
    window.app.store.jwt = null
    window.app.router.go("/")
  },
  saveToCollection: async (movie_id: any, collection: any) => {
    if (window.app.store.loggedIn) {
      try {
        const response = await API.saveToCollection(movie_id, collection);
        if (response.success) {
          switch (collection) {
            case "favorite":
              window.app.router.go("/account/favorites")
              break;
            case "watchlist":
              window.app.router.go("/account/watchlist")
          }
        } else {
          window.app.showError("We couldn't save the movie.")
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      window.app.router.go("/account/");
    }
  },
  deleteFromCollection: async (movie_id: any, collection: any) => {
    if (window.app.store.loggedIn) {
      try {
        const response = await API.deleteFromCollection(movie_id, collection);
        if (response.success) {
          switch (collection) {
            case "favorite":
              window.app.router.go("/account/favorites")
              break;
            case "watchlist":
              window.app.router.go("/account/watchlist")
          }
        } else {
          window.app.showError("We couldn't save the movie.")
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      window.app.router.go("/account/");
    }
  },
}
