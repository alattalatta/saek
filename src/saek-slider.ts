import type { PropertyDeclarations } from 'lit'
import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import type { Interactive } from './saek-interactive'
import './saek-interactive'

class Slider extends LitElement {
  static properties: PropertyDeclarations = {
    max: { type: Number },
    min: { type: Number },
    step: { type: Number },
    value: { type: Number },
  }

  static styles = css`
    :host {
      display: block;
      height: 1em;
      margin: 16px;
    }

    [part='slider'] {
      height: 100%;
      cursor: w-resize;
      display: block;
      position: relative;
    }

    [part='thumb'] {
      height: 100%;
      aspect-ratio: 1;
      background: #f2f2f2;
      border: 2px solid #444444;
      border-radius: 50%;
      cursor: w-resize;
      position: absolute;
      top: -2px;
      left: var(--thumb-position);
      transform: translateX(-50%);
    }

    [part='slider']:focus-within > [part='thumb'] {
      border-color: #00b7ff;
    }

    input {
      width: 1px;
      clip: 1px;
      opacity: 0;
      position: absolute;
    }
  `

  max: number
  min: number
  step: number
  value: number

  #interactiveRef = createRef<Interactive>()

  constructor() {
    super()

    this.max = 1
    this.min = 0
    this.step = 0.01
    this.value = 0.5
  }

  protected render(): unknown {
    const distanceFromMin = this.value - this.min
    const distancePercentage = distanceFromMin / (this.max - this.min)

    return html`
      <saek-interactive ${ref(this.#interactiveRef)} part="slider" @input=${this.#updateValueFromPointer}>
        <div part="thumb" style="left: ${distancePercentage * 100}%"></div>
        <input
          type="range"
          max=${this.max}
          min=${this.min}
          step=${this.step}
          value=${this.value}
          @input=${this.#updateValueFromKeyboard}
        />
      </saek-interactive>
    `
  }

  #updateValueFromKeyboard = (event: InputEvent): void => {
    event.stopPropagation()
    this.value = parseFloat((event.target as HTMLInputElement).value)

    this.dispatchEvent(new InputEvent('input'))
  }

  #updateValueFromPointer = (event: InputEvent): void => {
    event.stopPropagation()
    this.value = (this.max - this.min) * ((event.target as Interactive).value?.[0] ?? 0.5) + this.min

    this.dispatchEvent(new InputEvent('input'))
  }
}

customElements.define('saek-slider', Slider)

export { Slider }
