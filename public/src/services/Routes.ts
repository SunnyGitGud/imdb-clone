import { RegisterPage } from "../components/registerPage.js";
import { HomePage } from "../components/homepage.js";
import { MovieDetailsPage } from "../components/movieDetailsPage.js";
import { MoviesPage } from "../components/moviePage.js";
import { LoginPage } from "../components/loginPage.js";
import { AccountPage } from "../components/accountPage.js";
import { FavoritePage } from "../components/favoritePage.js";
import { WatchlistPage } from "../components/watchlistPage.js";

export interface RouteComponent extends HTMLElement {
  params?: string[];
}
export interface Route {
  path: string | RegExp;
  component: new () => RouteComponent;
  loggedIn?: boolean
}
export const routes: Route[] = [
  {
    path: "/",
    component: HomePage
  },
  {
    path: /\/movies\/(\d+)/,
    component: MovieDetailsPage
  },
  {
    path: "/movies",
    component: MoviesPage
  },
  {
    path: "/account/register",
    component: RegisterPage
  },
  {
    path: "/account/login",
    component: LoginPage
  },
  {
    path: "/account/",
    component: AccountPage,
    loggedIn: true
  },
  {
    path: "/account/favorites",
    component: FavoritePage,
    loggedIn: true
  },
  {
    path: "/account/watchlist",
    component: WatchlistPage,
    loggedIn: true
  }
]
