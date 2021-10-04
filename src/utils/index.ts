const REGEXP_IS_HEX = /^#?[0-9A-Fa-f]{3,6}$/
export function isHEX(value: string): boolean {
  return REGEXP_IS_HEX.test(value)
}

export function numberToPxOrString(value: string | number): string {
  if (typeof value === 'string') {
    return value
  }

  return value + 'px'
}

export default {
  isHEX,
  numberToPxOrString
}
