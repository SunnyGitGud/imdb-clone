import { API } from "./services/api";
import { Router } from "./services/Router";
import proxiedStore from "./services/store";

declare global {
  interface Window {
    app: {
      search: (event: Event) => void;
      router: typeof Router;
      store: typeof proxiedStore
      showError: (message?: string, goToHome?: boolean) => void;
      closeError: () => void;
      searchOrderChange: (order: any) => void;
      searchFilterChange: (genre: any) => void;
      register: (event: Event) => void;
      login: (event: Event) => void;
      logout: () => void;
      API: typeof API;
      saveToCollection: (movie_id: any, collection: any) => void;
      deleteFromCollection: (movie_id: any, collection: any) => void;
    };
  }
}

