import { CanvasNotSupportedError, ShaderCompileError } from './errors'
import type { Program } from './program'
import { createProgram } from './program'

type Context = {
  compileShader: (type: number, source: string) => WebGLShader
  createProgram: <UniformKeys extends string = string>(
    vertex: WebGLShader,
    fragment: WebGLShader,
  ) => Program<UniformKeys>
  draw: () => void
  gl: WebGL2RenderingContext
  resize: (width: number, height: number) => void
}

function setup(element: HTMLCanvasElement): Context {
  const gl = element.getContext('webgl2')
  if (!gl) {
    throw new CanvasNotSupportedError()
  }

  const arrayBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer)
  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    -1,  1,
     1,  1,
     1, -1
  ]), gl.STATIC_DRAW)

  const elementArrayBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementArrayBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)

  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)

  const compileShader = (type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type)
    if (!shader) {
      throw new CanvasNotSupportedError()
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new ShaderCompileError(gl.getShaderInfoLog(shader))
    }

    return shader
  }

  const createProgramWrap = <UniformKeys extends string = string>(
    vertex: WebGLShader,
    fragment: WebGLShader,
  ): Program<UniformKeys> => {
    const program = createProgram(gl, vertex, fragment)
    return program
  }

  const draw = (): void => {
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }

  const resize = (width: number, height: number): void => {
    element.width = width
    element.height = height
    gl.viewport(0, 0, width, height)
  }

  return {
    gl,
    compileShader,
    createProgram: createProgramWrap,
    draw,
    resize,
  }
}

export type { Context }
export { setup }
