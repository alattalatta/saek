import { CanvasNotSupportedError, ProgramLinkError } from './errors'

type Program = {
  apply: () => void
  destroy: () => void
}

function createProgram(gl: WebGL2RenderingContext, vertex: WebGLShader, fragment: WebGLShader): Program {
  const program = gl.createProgram()
  if (!program) {
    throw new CanvasNotSupportedError()
  }

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new ProgramLinkError(gl.getProgramInfoLog(program))
  }

  const apply = (): void => {
    gl.useProgram(program)
  }

  const destroy = (): void => {
    gl.deleteProgram(program)
  }

  return {
    apply,
    destroy,
  }
}

export type { Program }
export { createProgram }
