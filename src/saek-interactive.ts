import type { PropertyDeclarations } from 'lit'
import { html, LitElement } from 'lit'

import { clamp } from './lib/number'
import type { Vec2 } from './lib/vec2'
import { vec2 } from './lib/vec2'

class Interactive extends LitElement {
  static properties: PropertyDeclarations = {
    value: {
      converter: {
        fromAttribute: (value) => {
          if (!value) {
            return null
          }

          const [x, y] = value
            .split(',')
            .map(Number)
            .filter((v) => v != null && !isNaN(v))
          if (x == null || y == null) {
            return null
          }

          return vec2(x, y)
        },
        toAttribute: (value: Vec2) => {
          return value?.toString()
        },
      },
    },
  }

  value: Vec2 | null

  #boundingRect = new DOMRect(0, 0, 0, 0)
  #dragging = false

  constructor() {
    super()

    this.value = null

    this.addEventListener('pointerdown', this.#dragStart)
  }

  connectedCallback(): void {
    super.connectedCallback()

    window.addEventListener('pointermove', this.#updateValueFromPointer)
    window.addEventListener('pointerup', this.#dragEnd)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    window.removeEventListener('pointermove', this.#updateValueFromPointer)
    window.removeEventListener('pointerup', this.#dragEnd)
  }

  protected render(): unknown {
    return html`<slot></slot>`
  }

  #dragEnd = (): void => {
    this.#dragging = false

    this.dispatchEvent(new PointerEvent('pointerup'))
  }

  #dragStart = (event: PointerEvent): void => {
    this.#boundingRect = this.getBoundingClientRect()
    this.#dragging = true
    this.#updateValueFromPointer(event)
  }

  #updateValueFromPointer = (event: PointerEvent): void => {
    if (this.#dragging) {
      event.preventDefault() // disables unwanted block selection
      const xpos = event.clientX - this.#boundingRect.x
      const ypos = this.#boundingRect.height - (event.clientY - this.#boundingRect.y)
      this.value = vec2(
        clamp(0, this.#boundingRect.width, xpos) / this.#boundingRect.width,
        clamp(0, this.#boundingRect.height, ypos) / this.#boundingRect.height,
      )

      this.dispatchEvent(new InputEvent('input'))
    }
  }
}

customElements.define('saek-interactive', Interactive)

export { Interactive }
