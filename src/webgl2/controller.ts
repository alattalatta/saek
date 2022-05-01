import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { Ref } from 'lit/directives/ref'

import frag from '../oklab.glsl'
import vertex from '../vertex.glsl'
import type { Program, UniformTV } from './program'
import { setup } from './setup'
import type { Context } from './setup'

export class WebGL2CanvasController<UniformKeys extends string> implements ReactiveController {
  context: Context | null = null

  private init = false
  private lastUMap: Record<UniformKeys, UniformTV> | null = null
  private program: Program<UniformKeys | 'u_resolution'> | null = null
  private timer: number | null = null

  constructor(private host: ReactiveControllerHost, private canvasRef: Ref<HTMLCanvasElement>) {
    this.host.addController(this)
  }

  draw(umap: Record<UniformKeys, UniformTV>): void {
    this.lastUMap = umap

    if (this.context && this.program) {
      this.timer = null

      this.program.apply({
        ...umap,
        u_resolution: ['2f', this.context.Resolution],
      })
      this.context.draw()
    }
  }

  hostDisconnected(): void {
    this.init = false
    this.lastUMap = null
    this.program = null

    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  }

  hostUpdated(): void {
    if (!this.canvasRef.value) {
      return
    }

    if (!this.init) {
      return this.initialize()
    }

    if (this.timer) {
      window.clearTimeout(this.timer)
    }

    this.timer = window.setTimeout(() => this.lastUMap && this.draw(this.lastUMap))
  }

  updateViewport(width: number, height: number): void {
    if (this.context) {
      this.context.resize(width, height)
      this.lastUMap && this.draw(this.lastUMap)
    }
  }

  private initialize(): void {
    if (!this.canvasRef.value) {
      return
    }

    this.init = true

    this.context = setup(this.canvasRef.value)

    const shaderFrag = this.context.compileShader(this.context.gl.FRAGMENT_SHADER, frag)
    const shaderVert = this.context.compileShader(this.context.gl.VERTEX_SHADER, vertex)
    this.program = this.context.createProgram(shaderVert, shaderFrag)
  }
}
