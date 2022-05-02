import { css, html, LitElement } from 'lit'

import './saek-color-square'

class App extends LitElement {
  static styles = css`
    :host {
      color: blue;
      display: block;
    }

    saek-color-square {
      width: 300px;
    }
  `

  protected render(): unknown {
    return html`<div>
      <saek-color-square hue="180"></saek-color-square>
    </div>`
  }
}

customElements.define('saek-app', App)

export { App }
