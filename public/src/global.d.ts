import { Router } from "./services/Router";

declare global {
  interface Window {
    app: {
      search: (event: Event) => void;
      router: typeof Router;
      showError: (message?: string, goToHome?: boolean) => void;
      closeError: () => void
    };
  }
}

