import { API } from "../services/api.js"
import { CollectionPage } from "./collectionPage.js"

export class WatchlistPage extends CollectionPage {
  constructor() {
    super(API.getWatchlist, "Watchlist Movies", "watchlist")
  }
}

customElements.define("watchlist-page", WatchlistPage)
