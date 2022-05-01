import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import type { Canvas } from './saek-canvas'
import './saek-canvas'

class ColorSquare extends LitElement {
  static properties = {
    hue: { type: Number },
  }

  static styles = css`
    :host {
      display: block;
    }
  `

  hue: number

  private rendererRef = createRef<Canvas<'u_hue'>>()

  constructor() {
    super()
    this.hue = 0
  }

  protected render(): unknown {
    return html`<saek-canvas ${ref(this.rendererRef)} .uniforms=${{ u_hue: ['1f', [this.hue]] }}></saek-canvas>`
  }

  protected updated(): void {
    this.rendererRef.value?.requestUpdate()
  }
}

customElements.define('saek-color-square', ColorSquare)

export { ColorSquare as GG }
