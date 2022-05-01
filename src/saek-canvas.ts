import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import { WebGL2CanvasController } from './webgl2'

class CanvasWebGL2 extends LitElement {
  static properties = {
    hue: { state: true },
  }

  static styles = css`
    :host {
      display: block;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `

  private canvasRef = createRef<HTMLCanvasElement>()
  private canvasController = new WebGL2CanvasController<'u_hue'>(this, this.canvasRef)
  private observer: ResizeObserver | null = null

  private hue: number

  constructor() {
    super()
    this.hue = 0
  }

  connectedCallback(): void {
    super.connectedCallback()

    this.observer = new ResizeObserver((entries) => {
      const self = entries[0]
      const size = self.contentBoxSize[0]
      this.canvasController.updateViewport(size.inlineSize, size.blockSize)
    })
    this.observer.observe(this)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.observer) {
      this.observer.disconnect()
    }
  }

  protected render(): unknown {
    return html`
      <canvas ${ref(this.canvasRef)}></canvas>
      <input type="range" min="0" max="360" step="0.01" value=${this.hue} @input=${this.updateHue} />
      <p>${this.hue}</p>
    `
  }

  protected updated(): void {
    this.canvasController.draw({
      u_hue: ['1f', [this.hue]],
    })
  }

  private updateHue(event: InputEvent): void {
    const target = event.target as HTMLInputElement
    this.hue = Number(target.value || 0)
  }
}

customElements.define('saek-canvas', CanvasWebGL2)

export { CanvasWebGL2 }
