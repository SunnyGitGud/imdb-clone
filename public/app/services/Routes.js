import { HomePage } from "../components/homepage.js";
import { MovieDetailsPage } from "../components/movieDetailsPage.js";
import { MoviePage } from "../components/moviePage.js";
export const routes = [
    { path: "/", component: HomePage },
    { path: /\/movies\/(\d+)/, component: MovieDetailsPage },
    { path: "/movies", component: MoviePage },
];
