import type { PropertyDeclarations, PropertyValues } from 'lit'
import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import type { UniformTV } from './webgl2'
import { WebGL2CanvasController } from './webgl2'

type Shaders = readonly (readonly [string, string])[]

class Canvas<UniformKeys extends string> extends LitElement {
  static properties: PropertyDeclarations = {
    shaders: {
      attribute: 'shaders',
      hasChanged: (a: Shaders, b: Shaders) => {
        return JSON.stringify(a) !== JSON.stringify(b)
      },
      type: Array,
    },
    uniforms: { type: Object },
  }

  static styles = css`
    :host {
      display: block;
      overflow: hidden;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `

  shaders: readonly (readonly [string, string])[]
  uniforms: Record<UniformKeys, UniformTV>

  private canvasController: WebGL2CanvasController<UniformKeys>
  private observer: ResizeObserver | null = null
  private rendererRef = createRef<HTMLCanvasElement>()

  constructor() {
    super()
    this.shaders = []
    this.uniforms = {} as Record<UniformKeys, UniformTV>

    this.canvasController = new WebGL2CanvasController<UniformKeys>(this, this.rendererRef)
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

    this.observer?.disconnect()
  }

  protected render(): unknown {
    return html`<canvas ${ref(this.rendererRef)}></canvas>`
  }

  protected updated(changedProperties: PropertyValues): void {
    if (!this.canvasController.shadersInitialized || changedProperties.has('shaders')) {
      this.canvasController.recompileAndDraw(this.shaders, this.uniforms)
    } else {
      this.canvasController.draw(this.uniforms)
    }
  }
}

customElements.define('saek-canvas', Canvas)

export { Canvas }
