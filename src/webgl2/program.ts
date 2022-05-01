import { CanvasNotSupportedError, ProgramLinkError } from './errors'

type KeyedTuple<T> = { [K in keyof T]: [K, T[K]] }[keyof T]

type UniformDimension = 1 | 2 | 3 | 4
type UniformDataType = `${'f' | 'i' | 'ui'}`
type UniformType = `${UniformDimension}${UniformDataType}`

type UniformParam<T> = T extends `1${string}`
  ? readonly [number]
  : T extends `2${string}`
  ? readonly [number, number]
  : T extends `3${string}`
  ? readonly [number, number, number]
  : T extends `4${string}`
  ? readonly [number, number, number, number]
  : never
type UniformParamsMap = {
  [key in UniformType]: UniformParam<key>
}

export type UniformTV = KeyedTuple<UniformParamsMap>

type Program<UniformKeys extends string> = {
  apply: (umap: Record<UniformKeys, UniformTV>) => void
  destroy: () => void
}

function createProgram<UniformKeys extends string = string>(
  gl: WebGL2RenderingContext,
  vertex: WebGLShader,
  fragment: WebGLShader,
): Program<UniformKeys> {
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

  const uniforms = {} as Record<UniformKeys, WebGLUniformLocation>
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number

  for (let i = 0; i < uniformCount; i++) {
    const activeInfo = gl.getActiveUniform(program, i)
    if (!activeInfo) {
      continue
    }

    const location = gl.getUniformLocation(program, activeInfo.name)
    if (location) {
      uniforms[activeInfo.name as UniformKeys] = location
    }
  }

  const apply = (u: Record<UniformKeys, UniformTV>): void => {
    gl.useProgram(program)

    for (const name of Object.keys(u) as UniformKeys[]) {
      const [type, values] = u[name]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
      ;(gl[`uniform${type}`] as any)(uniforms[name], ...values)
    }
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
