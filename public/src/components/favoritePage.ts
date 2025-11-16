import { API } from "../services/api.js"
import { CollectionPage } from "./collectionPage.js"

export class FavoritePage extends CollectionPage {
  constructor() {
    super(API.getFavorites, "Favorite Movies", "favorite")
  }
}

customElements.define("favorite-page", FavoritePage)
