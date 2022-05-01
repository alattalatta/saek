class CanvasNotSupportedError extends Error {
  constructor() {
    super('WebGL2 is not supported')
  }
}

class ProgramLinkError extends Error {
  constructor(public readonly log: string | null) {
    super('Error while linking program')
    console.info(log)
  }
}

class ShaderCompileError extends Error {
  constructor(public readonly log: string | null) {
    super('Error while compiling shader')
    console.info(log)
  }
}

export { CanvasNotSupportedError, ProgramLinkError, ShaderCompileError }
