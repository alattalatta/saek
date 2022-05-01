import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import red from './red.glsl'
import vertex from './vertex.glsl'
import type { Context } from './webgl2'
import { setup } from './webgl2'

class CanvasWebGL2 extends LitElement {
  static properties = {
    button: { state: true },
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
  private context: Context | null = null
  private observer: ResizeObserver | null = null
  private raf: number | null = null

  constructor() {
    super()
  }

  connectedCallback(): void {
    super.connectedCallback()

    this.observer = new ResizeObserver((entries) => {
      const self = entries[0]
      const size = self.contentBoxSize[0]
      this.updateViewport(size.inlineSize, size.blockSize)
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
    if (this.canvasRef.value) {
      this.context = setup(this.canvasRef.value)

      const shaderFrag = this.context.compileShader(this.context.gl.FRAGMENT_SHADER, red)
      const shaderVert = this.context.compileShader(this.context.gl.VERTEX_SHADER, vertex)
      const program = this.context.createProgram(shaderVert, shaderFrag)
      program.apply()

      const draw = (): void => {
        if (!this.context) {
          this.raf && cancelAnimationFrame(this.raf)
          this.raf = null
          return
        }

        this.context.draw()
        // this.raf = requestAnimationFrame(draw)
      }

      setTimeout(draw)
      // requestAnimationFrame(draw)
    }
  }

  protected render(): unknown {
    return html`<canvas ${ref(this.canvasRef)}></canvas>`
  }

  private updateViewport(width: number, height: number): void {
    if (this.context) {
      this.context.resize(width, height)
    }
  }
}

customElements.define('saek-canvas', CanvasWebGL2)

export { CanvasWebGL2 }
