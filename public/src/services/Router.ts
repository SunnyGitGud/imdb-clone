import { RouteComponent, routes } from "./Routes.js";

export const Router = {
  init: () => {
    window.addEventListener("popstate", () => {
      Router.go(location.pathname, false);
    });

    Router.go(location.pathname + location.search);
  },

  go: (route: string, addtoHistory = true) => {
    if (addtoHistory) {
      history.pushState(null, "", route);
    }

    let pageElement: RouteComponent | null = null;
    const routePath = route.includes("?") ? route.split("?")[0] : route;

    for (const r of routes) {
      if (typeof r.path === "string" && r.path === routePath) {
        pageElement = new r.component();
        break;
      }

      if (r.path instanceof RegExp) {
        const match = r.path.exec(route);
        if (match) {
          pageElement = new r.component();
          pageElement.params = match.slice(1);
          break;
        }
      }
    }

    if (!pageElement) {
      pageElement = document.createElement("h1") as RouteComponent;
      pageElement.textContent = "Page not found";
    }
    const main = document.querySelector("main");
    main!.innerHTML = "";
    main!.appendChild(pageElement);
  }
};
