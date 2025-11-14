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

  fetch: async (serviceName: string, args?: any) => {
    try {
      const queryString = args ? new URLSearchParams(args).toString() : "";
      const url = API.baseURL + serviceName + (queryString ? "?" + queryString : "");
      const resp = await fetch(url);
      const res = await resp.json();
      return res;
    } catch (e) {
      console.error(e);
      throw e; // Re-throw so calling code knows it failed
    }
  }
};
