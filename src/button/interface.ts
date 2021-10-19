import { Color, Direction, Icon, Position } from '../utils/interface'

export type ButtonSize = 'tiny' | 'small' | 'medium' | 'large' | 'giant'
export type ButtonType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  label?: string | number,

  color?: Color,
  type?: ButtonType,
  size?: ButtonSize,
  icon?: Icon,
  position?: Position,
  direction?: Direction,

  fab?: boolean,
  flat?: boolean,
  block?: boolean,
  round?: boolean,
  rounded?: boolean,
  toolbar?: boolean,
  outline?: boolean,
  depressed?: boolean,

  loading?: boolean,
  disabled?: boolean,
  autofocus?: boolean,

  name?: string,

  tabindex?: string | number,

  onClick?: (event: MouseEvent) => void,
  onMouseover?: (event: MouseEvent) => void,
  onMouseout?: (event: MouseEvent) => void
}
