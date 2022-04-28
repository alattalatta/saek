import { css, html, LitElement } from 'lit'

class App extends LitElement {
  static styles = css`
    :host {
      color: blue;
    }
  `

  protected render(): unknown {
    return html`<p>Hello, Lit!</p>`
  }
}

customElements.define('saek-app', App)
