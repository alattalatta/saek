import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import frag from './oklab.glsl'
import vertex from './vertex.glsl'
import type { Context } from './webgl2'
import { setup } from './webgl2'
import type { Program } from './webgl2/program'

type UniformKeys = 'u_hue' | 'u_resolution'

class CanvasWebGL2 extends LitElement {
  static properties = {
    red: { state: true },
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
  private program: Program<UniformKeys> | null = null
  private timer: number | null = null

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

      const shaderFrag = this.context.compileShader(this.context.gl.FRAGMENT_SHADER, frag)
      const shaderVert = this.context.compileShader(this.context.gl.VERTEX_SHADER, vertex)
      this.program = this.context.createProgram(shaderVert, shaderFrag)
    }
  }

  protected render(): unknown {
    return html`
      <canvas ${ref(this.canvasRef)}></canvas>
      <input type="range" min="0" max="360" step="0.01" value=${this.hue} @input=${this.updateRed} />
      <p>${this.hue}</p>
    `
  }

  protected updated(): void {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }

    this.timer = window.setTimeout(this.draw)
  }

  private draw = (): void => {
    if (this.context && this.program) {
      this.timer = null

      this.program.apply({
        u_hue: ['1f', [this.hue]],
        u_resolution: ['2f', this.context.Resolution],
      })
      this.context.draw()
    }
  }

  private updateRed(event: InputEvent): void {
    const target = event.target as HTMLInputElement
    this.hue = Number(target.value || 0)
  }

  private updateViewport(width: number, height: number): void {
    if (this.context) {
      this.context.resize(width, height)
      this.draw()
    }
  }
}

customElements.define('saek-canvas', CanvasWebGL2)

export { CanvasWebGL2 }
