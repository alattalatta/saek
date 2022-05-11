import type { PropertyDeclarations } from 'lit'
import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import lab from './glsl/lab.glsl'
import oklab from './glsl/oklab.glsl'
import type { Canvas } from './saek-canvas'
import type { Slider } from './saek-slider'
import vrtx from './vertex.glsl'

import './saek-canvas'
import './saek-slider'

class ColorSquare extends LitElement {
  static properties: PropertyDeclarations = {
    forceGamut: { state: true },
    hue: { type: Number },
    ok: { state: true },
  }

  static styles = css`
    :host {
      display: block;
    }

    saek-canvas {
      width: 300px;
      height: 300px;
      border-radius: 4px;
    }

    saek-slider::part(slider) {
      background: linear-gradient(to right, white, black);
      border-radius: 4px;
    }
  `

  forceGamut: boolean
  hue: number
  ok: boolean

  private rendererRef = createRef<Canvas<'u_chroma_max' | 'u_force_gamut' | 'u_hue'>>()

  constructor() {
    super()
    this.forceGamut = false
    this.hue = 0
    this.ok = false
  }

  protected render(): unknown {
    return html`<saek-canvas
        ${ref(this.rendererRef)}
        .shaders=${[[vrtx, this.ok ? oklab : lab]] as const}
        .uniforms=${{
          u_chroma_max: ['1f', [this.ok ? 33 : 134]],
          u_force_gamut: ['1f', [this.forceGamut ? 1 : 0]],
          u_hue: ['1f', [this.hue]],
        }}
      ></saek-canvas>
      <saek-slider max="360" min="0" step="0.1" value=${this.hue} @input=${this.#updateHue}></saek-slider>
      <button @click=${() => (this.ok = !this.ok)}>${this.ok ? 'OKLAB' : 'LAB'}</button>
      <button @click=${() => (this.forceGamut = !this.forceGamut)}>${this.forceGamut ? 'FORCED' : 'NORMAL'}</button>`
  }

  protected updated(): void {
    this.rendererRef.value?.requestUpdate()
  }

  #updateHue = (event: InputEvent): void => {
    this.hue = (event.target as Slider).value
  }
}

customElements.define('saek-color-square', ColorSquare)

export { ColorSquare as GG }
