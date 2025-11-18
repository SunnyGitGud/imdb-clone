import { AccountPage } from "src/components/accountPage";
import { ActorsDetailsPage } from "src/components/actorsPage";
import { FavoritePage } from "src/components/favoritePage";
import { HomePage } from "src/components/homepage";
import { LoginPage } from "src/components/loginPage";
import { MovieDetailsPage } from "src/components/movieDetailsPage";
import { MoviesPage } from "src/components/moviePage";
import { RegisterPage } from "src/components/registerPage";
import { WatchlistPage } from "src/components/watchlistPage";
export const routes = [
    {
        path: "/",
        component: HomePage
    },
    {
        path: /\/movies\/(\d+)/,
        component: MovieDetailsPage
    },
    {
        path: /\/actors\/(\d+)/,
        component: ActorsDetailsPage
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
];
