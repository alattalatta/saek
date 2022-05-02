import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import lab from './glsl/lab.glsl'
import oklab from './glsl/oklab.glsl'
import type { Canvas } from './saek-canvas'
import vrtx from './vertex.glsl'
import './saek-canvas'

class ColorSquare extends LitElement {
  static properties = {
    force: { state: true },
    hue: { type: Number },
    ok: { state: true },
  }

  static styles = css`
    :host {
      display: block;
    }
  `

  force: boolean
  hue: number
  ok: boolean

  private rendererRef = createRef<Canvas<'u_hue' | 'u_force_gamut'>>()

  constructor() {
    super()
    this.force = false
    this.hue = 0
    this.ok = false
  }

  protected render(): unknown {
    return html`<saek-canvas
        ${ref(this.rendererRef)}
        .shaders=${[[vrtx, this.ok ? oklab : lab]] as const}
        .uniforms=${{ u_force_gamut: ['1f', [this.force ? 1 : 0]], u_hue: ['1f', [this.hue]] }}
      ></saek-canvas>
      <button @click=${() => (this.ok = !this.ok)}>${this.ok ? 'OKLAB' : 'LAB'}</button>
      <button @click=${() => (this.force = !this.force)}>${this.force ? 'FORCED' : 'NORMAL'}</button>`
  }

  protected updated(): void {
    this.rendererRef.value?.requestUpdate()
  }
}

customElements.define('saek-color-square', ColorSquare)

export { ColorSquare as GG }
