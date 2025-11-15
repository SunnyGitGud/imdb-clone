interface StoreType {
  jwt: string | null;
  readonly loggedIn: boolean;
}

const Store: StoreType = {
  jwt: null,
  get loggedIn() {
    return this.jwt != null;
  }
};

if (localStorage.getItem("jwt")) {
  Store.jwt = localStorage.getItem("jwt")
}


//Its like an event listener it saves the value to storage 
//when changing it in store Store.jwt = "new" will also change 
//and store in the local browser storage
const proxiedStore = new Proxy(Store, {
  set: (target, prop, value) => {
    if (prop === "jwt") {
      target[prop] = value as string | null;
      localStorage.setItem("jwt", value as string);
    }
    return true; // Proxy set trap must return a boolean
  }
});

export default proxiedStore

