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

export function normalizedValue(value: string | number): number {
  value = parseFloat(value + '')

  if (isNaN(value) || value < 0) {
    value = 0
  }

  if (value > 100) {
    value = 100
  }

  return value
}

export default {
  isHEX,
  numberToPxOrString,
  normalizedValue
}
