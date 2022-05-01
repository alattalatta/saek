import { css, html, LitElement } from 'lit'
import { createRef, ref } from 'lit/directives/ref'

import type { UniformTV } from './webgl2'
import { WebGL2CanvasController } from './webgl2'

class Canvas<UniformKeys extends string> extends LitElement {
  static properties = {
    uniforms: { type: Object },
  }

  static styles = css`
    :host,
    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `

  rendererRef = createRef<HTMLCanvasElement>()
  uniforms = {} as Record<UniformKeys, UniformTV>

  private canvasController = new WebGL2CanvasController<UniformKeys>(this, this.rendererRef)
  private observer: ResizeObserver | null = null

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
    this.canvasController.draw(this.uniforms)
    return html`<canvas ${ref(this.rendererRef)}></canvas>`
  }
}

customElements.define('saek-canvas', Canvas)

export { Canvas }
