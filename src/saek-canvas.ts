import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

class CanvasWebGL2 extends LitElement {
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
  private gl: WebGL2RenderingContext | null = null
  private observer: ResizeObserver | null = null

  connectedCallback(): void {
    super.connectedCallback()

    this.observer = new ResizeObserver((entries) => {
      const self = entries[0]
      const size = self.contentBoxSize[0]
      this.updateViewport(size.blockSize, size.inlineSize)
    })
    this.observer.observe(this)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.observer) {
      this.observer.disconnect()
    }
  }

  protected firstUpdated(): void {
    this.gl = this.canvasRef.value?.getContext('webgl2') || null
  }

  protected render(): unknown {
    return html`<canvas ${ref(this.canvasRef)}></canvas>`
  }

  private updateViewport(height: number, width: number): void {
    if (this.canvasRef.value) {
      const canvas = this.canvasRef.value
      canvas.height = height
      canvas.width = width
    }

    if (this.gl) {
      this.gl.viewport(0, 0, width, height)
    }
  }
}

customElements.define('saek-canvas', CanvasWebGL2)

export { CanvasWebGL2 }
