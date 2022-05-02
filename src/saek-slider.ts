import type { PropertyDeclarations } from 'lit'
import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

class Slider extends LitElement {
  static properties: PropertyDeclarations = {
    dragging: { state: true },
    max: { type: Number },
    min: { type: Number },
    step: { type: Number },
    value: { type: Number },
    width: { state: true },
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

  #dragging: boolean

  #sliderBox: DOMRect | null = null
  #sliderRef = createRef<HTMLDivElement>()
  #thumbRef = createRef<HTMLInputElement>()

  constructor() {
    super()

    this.max = 1
    this.min = 0
    this.step = 0.01
    this.value = 0.5

    this.#dragging = false
  }

  connectedCallback(): void {
    super.connectedCallback()

    window.addEventListener('pointermove', this.#handleDrag)
    window.addEventListener('pointerup', this.#dragEnd)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    window.removeEventListener('pointermove', this.#handleDrag)
    window.removeEventListener('pointerup', this.#dragEnd)
  }

  protected render(): unknown {
    const distanceFromMin = this.value - this.min
    const distancePercentage = distanceFromMin / (this.max - this.min)

    return html`
      <div ${ref(this.#sliderRef)} part="slider" @pointerdown=${this.#dragStart}>
        <div part="thumb" style="left: ${distancePercentage * 100}%"></div>
        <input
          ${ref(this.#thumbRef)}
          type="range"
          max=${this.max}
          min=${this.min}
          step=${this.step}
          value=${this.value}
          @input=${this.#updateValueFromKeyboard}
        />
      </div>
    `
  }

  #dragEnd = (): void => {
    this.#dragging = false
  }

  #dragStart = (event: PointerEvent): void => {
    if (this.#sliderRef.value) {
      this.#dragging = true
      this.#sliderBox = this.#sliderRef.value.getBoundingClientRect()
      this.#updateValueFromPointer(event)
    }
  }

  #handleDrag = (event: PointerEvent): void => {
    this.#updateValueFromPointer(event)
  }

  #updateValueFromKeyboard = (event: InputEvent): void => {
    event.stopPropagation()
    this.value = parseFloat((event.target as HTMLInputElement).value)

    this.dispatchEvent(new InputEvent('input'))
  }

  #updateValueFromPointer = (event: PointerEvent): void => {
    if (this.#dragging && this.#sliderBox) {
      event.preventDefault() // disables unwanted block selection
      const xpos = event.clientX - this.#sliderBox.x
      this.value = (clamp(this.#sliderBox.width, 0, xpos) / this.#sliderBox.width) * (this.max - this.min) + this.min

      this.dispatchEvent(new InputEvent('input'))
    }
  }
}

function clamp(m: number, n: number, v: number): number {
  return Math.max(Math.min(m, v), n)
}

customElements.define('saek-slider', Slider)

export { Slider }
