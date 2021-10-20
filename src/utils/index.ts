import { Color, ComponentName, Direction, Position } from './interface'
import { icons } from './icons'

export const colors: Color[] = [ 'primary', 'secondary', 'info', 'warning', 'error', 'success', 'accent', 'white', 'black', 'grey', 'gray', 'transparent' ]
export const directions: Direction[] = [ 'top', 'bottom', 'left', 'right', 'center' ]
export const componentNames: ComponentName[] = [ 'avatar', 'button', 'card', 'checkbox', 'chip', 'date-picker', 'dialog', 'divider', 'empty', 'footer', 'form', 'icon', 'input', 'list', 'list-item', 'modal', 'overlay', 'panel-group', 'panel', 'progress', 'spoiler' ]
export const positions: Position[] = [ 'absolute', 'fixed' ]

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

export function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default {
  icons,
  colors,
  componentNames,
  directions,
  isHEX,
  numberToPxOrString,
  normalizedValue,
  capitalizeFirstLetter
}
