import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { Ref } from 'lit/directives/ref'

import type { Program, UniformTV } from './program'
import { setup } from './setup'
import type { Context } from './setup'

export class WebGL2CanvasController<UniformKeys extends string> implements ReactiveController {
  context: Context | null = null

  #initialized = false
  #lastUMap: Record<UniformKeys, UniformTV> | null = null
  #programs: readonly Program<UniformKeys | 'u_resolution'>[] = []
  #timer: number | null = null

  #shadersInitialized = false
  get shadersInitialized(): boolean {
    return this.#shadersInitialized
  }

  constructor(private host: ReactiveControllerHost, private canvasRef: Ref<HTMLCanvasElement>) {
    this.host.addController(this)
  }

  draw(umap: Record<UniformKeys, UniformTV>): void {
    if (!this.#initialized) {
      return this.#initialize()
    }

    if (this.#timer) {
      window.clearTimeout(this.#timer)
    }

    this.#lastUMap = umap
    this.#timer = window.setTimeout(() => this.#draw(umap))
  }

  hostDisconnected(): void {
    this.#initialized = false
    this.#lastUMap = null

    for (const program of this.#programs) {
      program.destroy()
    }

    if (this.#timer) {
      window.clearTimeout(this.#timer)
    }
  }

  recompileAndDraw(shaderSources: readonly (readonly [string, string])[], umap: Record<UniformKeys, UniformTV>): void {
    if (!this.#initialized) {
      this.#initialize()
    }

    if (!this.context) {
      return
    }

    if (!this.#shadersInitialized) {
      this.#shadersInitialized = true
    }

    const context = this.context
    this.#programs = shaderSources.map(([vrtx, frag]) => {
      const compiledVert = context.compileShader(context.gl.VERTEX_SHADER, vrtx)
      const compiledFrag = context.compileShader(context.gl.FRAGMENT_SHADER, frag)
      const program = context.createProgram(compiledVert, compiledFrag)

      return program
    })

    this.draw(umap)
  }

  updateViewport(width: number, height: number): void {
    if (this.context) {
      this.context.resize(width, height)
      this.#lastUMap && this.draw(this.#lastUMap)
    }
  }

  #initialize(): void {
    if (!this.canvasRef.value) {
      return
    }

    this.#initialized = true

    const context = setup(this.canvasRef.value)
    this.context = context
  }

  #draw(umap: Record<UniformKeys, UniformTV>): void {
    if (this.context) {
      this.#timer = null

      for (const program of this.#programs) {
        program.apply({
          ...umap,
          u_resolution: ['2f', this.context.resolution],
        })
      }

      this.context.draw()
    }
  }
}
