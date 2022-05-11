function clamp(min: number, max: number, a: number): number {
  return Math.max(min, Math.min(max, a))
}

function inRange(min: number, max: number, a: number): boolean {
  return a >= min && a <= max
}

export { clamp, inRange }
