import type { PropertyDeclarations } from 'lit'
import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'
import { styleMap } from 'lit/directives/style-map'

import labFrag from './glsl/lab.glsl'
import oklabFrag from './glsl/oklab.glsl'
import { lab2xyz } from './lib/color/lab2xyz'
import { unpolarize } from './lib/color/unpolarize'
import { xyz2srgb } from './lib/color/xyz2srgb'
import type { Vec2 } from './lib/vec2'
import { mult, vec3 } from './lib/vec3'
import type { Canvas } from './saek-canvas'
import type { Interactive } from './saek-interactive'
import type { Slider } from './saek-slider'
import vrtx from './vertex.glsl'
import type { UniformTV } from './webgl2'

import './saek-canvas'
import './saek-interactive'
import './saek-slider'

type UniformKeys = 'u_chroma_max' | 'u_force_gamut' | 'u_hue'

class ColorSquare extends LitElement {
  static properties: PropertyDeclarations = {
    forceGamut: { state: true },
    hue: { type: Number },
    ok: { state: true },
    pointer: { state: true },
  }

  static styles = css`
    :host {
      display: block;
    }

    saek-interactive {
      cursor: crosshair;
      display: block;
      position: relative;
    }

    saek-canvas {
      width: 300px;
      height: 300px;
      border-radius: 4px;
    }

    .preview {
      width: 48px;
      height: 48px;
      cursor: move;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    saek-slider::part(slider) {
      background: linear-gradient(to right, white, black);
      border-radius: 4px;
    }
  `

  forceGamut: boolean
  hue: number
  ok: boolean
  pointer: Vec2 | null

  private rendererRef = createRef<Canvas<UniformKeys>>()

  public get currentColor(): string {
    if (!this.pointer) {
      return 'none'
    }

    const l = this.pointer[1] * 100
    const c = this.pointer[0] * (this.ok ? 33 : 134)
    const h = this.hue
    const lch = vec3(l, c, h)
    const lab = unpolarize(lch)
    const xyz = lab2xyz(lab)
    const srgb = xyz2srgb(xyz)

    const final = mult(srgb, 100)

    return `rgb(${final[0]}% ${final[1]}% ${final[2]}%)`
  }

  public get uniforms(): Record<UniformKeys, UniformTV> {
    return {
      u_chroma_max: ['1f', [this.ok ? 33 : 134]],
      u_force_gamut: ['1f', [this.forceGamut ? 1 : 0]],
      u_hue: ['1f', [this.hue]],
    }
  }

  constructor() {
    super()
    this.forceGamut = false
    this.hue = 0
    this.ok = false
    this.pointer = null
  }

  protected render(): unknown {
    return html`<saek-interactive @input=${this.#updatePointer}>
        <saek-canvas
          ${ref(this.rendererRef)}
          .shaders=${[[vrtx, this.ok ? oklabFrag : labFrag]] as const}
          .uniforms=${this.uniforms}
        ></saek-canvas>
        ${this.pointer
          ? html`<div
              class="preview"
              style=${styleMap({
                backgroundColor: this.currentColor,
                transform: `translate(${300 * this.pointer[0]}px, ${300 * (1 - this.pointer[1])}px)`,
              })}
            ></div>`
          : null}
      </saek-interactive>
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

  #updatePointer = (event: InputEvent): void => {
    this.pointer = (event.target as Interactive).value
  }
}

customElements.define('saek-color-square', ColorSquare)

export { ColorSquare as GG }
