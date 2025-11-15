
export class LoginPage extends HTMLElement {
  connectedCallback() {
    const template = document.getElementById("template-login") as HTMLTemplateElement;
    const content = template.content.cloneNode(true);
    this.appendChild(content);
  }
}

customElements.define("login-page", LoginPage)
