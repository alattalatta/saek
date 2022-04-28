import { css, html, LitElement } from 'lit'

import './saek-canvas'

class App extends LitElement {
  static styles = css`
    :host {
      color: blue;
    }

    saek-canvas {
      width: 300px;
      height: 300px;
    }
  `

  protected render(): unknown {
    return html`<div>
      <saek-canvas></saek-canvas>
    </div>`
  }
}

customElements.define('saek-app', App)

export { App }
