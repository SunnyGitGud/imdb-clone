export class RegisterPage extends HTMLElement {
  connectedCallback() {
    const template = document.getElementById("template-register") as HTMLTemplateElement;
    const content = template.content.cloneNode(true);
    this.appendChild(content);
  }
}

customElements.define("register-page", RegisterPage)
