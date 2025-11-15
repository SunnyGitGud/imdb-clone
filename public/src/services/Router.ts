import { RouteComponent, routes } from "./Routes.js";
import proxiedStore from "./store.js";

export const Router = {
  init: () => {
    window.addEventListener("popstate", () => {
      Router.go(location.pathname, false);
    });
    document.querySelectorAll("a.navlink").forEach(a => {
      a.addEventListener("click", event => {
        event.preventDefault()
        const href = a.getAttribute("href")
        Router.go(href!)
      })
    })
    //go to initial route
    Router.go(location.pathname + location.search);
  },

  go: (route: string, addtoHistory = true) => {
    if (addtoHistory) {
      history.pushState(null, "", route);
    }

    let pageElement: RouteComponent | null = null;
    let needsLogin = false
    const routePath = route.includes("?") ? route.split("?")[0] : route;

    for (const r of routes) {
      if (typeof r.path === "string" && r.path === routePath) {
        pageElement = new r.component();
        needsLogin = r.loggedIn === true
        break;
      }

      if (r.path instanceof RegExp) {
        const match = r.path.exec(route);
        if (match) {
          pageElement = new r.component();
          pageElement.params = match.slice(1);
          needsLogin = r.loggedIn === true
          break;
        }
      }
    }
    if (pageElement) {
      if (needsLogin && window.app.store.loggedIn == false) {
        window.app.router.go("/account/login")
        return
      }
    }

    if (!pageElement) {
      pageElement = document.createElement("h1") as RouteComponent;
      pageElement.textContent = "Page not found";
    }
    //Inserting the new page in the UI
    const oldpage = document.querySelector("main")?.firstElementChild as HTMLElement;
    if (oldpage) oldpage.style.viewTransitionName = "old"
    pageElement.style.viewTransitionName = "new"

    if (!document.startViewTransition) {
      const main = document.querySelector("main");
      main!.innerHTML = "";
      main!.appendChild(pageElement);
    } else {
      document.startViewTransition(() => {
        const main = document.querySelector("main");
        main!.innerHTML = "";
        main!.appendChild(pageElement);
      })
    }
  }
};
