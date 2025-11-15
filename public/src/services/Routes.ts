import { RegisterPage } from "../components/registerPage.js";
import { HomePage } from "../components/homepage.js";
import { MovieDetailsPage } from "../components/movieDetailsPage.js";
import { MoviesPage } from "../components/moviePage.js";
import { LoginPage } from "../components/loginPage.js";

export interface RouteComponent extends HTMLElement {
  params?: string[];
}
export interface Route {
  path: string | RegExp;
  component: new () => RouteComponent;
}
export const routes: Route[] = [
  { path: "/", component: HomePage },
  { path: /\/movies\/(\d+)/, component: MovieDetailsPage },
  { path: "/movies", component: MoviesPage },
  { path: "/account/register", component: RegisterPage },
  { path: "/account/login", component: LoginPage },
]
