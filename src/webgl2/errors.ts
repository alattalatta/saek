class CanvasNotSupportedError extends Error {
  constructor() {
    super('WebGL2 is not supported')
  }
}

class ProgramLinkError extends Error {
  constructor(public readonly log: string | null) {
    super('Error while linking program')
  }
}

class ShaderCompileError extends Error {
  constructor(public readonly log: string | null) {
    super('Error while compiling shader')
  }
}

export { CanvasNotSupportedError, ProgramLinkError, ShaderCompileError }
