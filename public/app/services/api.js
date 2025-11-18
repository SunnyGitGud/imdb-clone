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
    getMovieById: async (id) => {
        return await API.fetch(`movies/${id}`);
    },
    getMovieByActorsId: async (id) => {
        return await API.fetch(`actors/${id}`);
    },
    searchMovies: async (q, order, genre) => {
        return await API.fetch("movies/search", { q, order, genre }); // Fixed: was using backtick incorrectly
    },
    register: async (name, email, password) => {
        return await API.send("account/register", { name, email, password });
    },
    login: async (email, password) => {
        return await API.send("account/login", { email, password });
    },
    getFavorites: async () => {
        return await API.fetch("account/favorites");
    },
    getWatchlist: async () => {
        return await API.fetch("account/watchlist");
    },
    saveToCollection: async (movieId, collection) => {
        return await API.send("account/save-to-collection", {
            movie_id: movieId,
            collection
        });
    },
    deleteFromCollection: async (movieId, collection) => {
        return await API.send("account/delete-from-collection", {
            movie_id: movieId,
            collection
        });
    },
    getUserMovieRelation: async (movieid) => {
        return await API.send("account/check-relation", {
            movie_id: movieid
        });
    },
    send: async (serviceName, data) => {
        try {
            const url = API.baseURL + serviceName;
            const headers = {
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
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    },
    fetch: async (serviceName, args) => {
        try {
            const queryString = args ? new URLSearchParams(args).toString() : "";
            const url = API.baseURL + serviceName + (queryString ? "?" + queryString : "");
            const headers = {};
            if (window.app.store.jwt) {
                headers.Authorization = `Bearer ${window.app.store.jwt}`;
            }
            const resp = await fetch(url, {
                headers,
            });
            return await resp.json();
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
};
