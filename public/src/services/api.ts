export const API = {
  baseURL: "/api/",

  getTopMovies: async () => {
    return await API.fetch("movies/top");
  },

  getRandomMovies: async () => {
    return await API.fetch("movies/random");
  },
  getGenreMovies: async () => {
    return await API.fetch("genre/");
  },

  getMovieById: async (id: number) => {
    return await API.fetch(`movies/${id}`); // Fixed: was using backtick incorrectly
  },

  searchMovies: async (q: string, order: string, genre: string) => {
    return await API.fetch("movies/search", { q, order, genre }); // Fixed: was using backtick incorrectly
  },

  register: async (name: string, email: string, password: string) => {
    return await API.send("account/register", { name, email, password })
  },
  login: async (email: string, password: string) => {
    return await API.send("account/login", { email, password })
  },
  getFavorites: async () => {
    return await API.fetch("account/favorites")
  },
  getWatchlist: async () => {
    return await API.fetch("account/watchlist")
  },
  saveToCollection: async (movieId: any, collection: any) => {
    return await API.send("account/save-to-collection", {
      movie_id: movieId,
      collection
    })
  },
  deleteFromCollection: async (movieId: any, collection: any) => {
    return await API.send("account/delete-from-collection", {
      movie_id: movieId,
      collection
    })
  },

  send: async (serviceName: string, data: any) => {
    try {
      const url = API.baseURL + serviceName;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (window.app.store.jwt) {
        headers.Authorization = `Bearer ${window.app.store.jwt}`;
      }

      const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      return await resp.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  fetch: async (serviceName: string, args?: any) => {
    try {
      const queryString = args ? new URLSearchParams(args).toString() : "";
      const url = API.baseURL + serviceName + (queryString ? "?" + queryString : "");

      const headers: Record<string, string> = {};

      if (window.app.store.jwt) {
        headers.Authorization = `Bearer ${window.app.store.jwt}`;
      }

      const resp = await fetch(url, {
        headers,
      });

      return await resp.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};
