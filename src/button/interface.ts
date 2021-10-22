import { ButtonHTMLAttributes } from 'vue'
import { Color, Direction, Icon, Position, Size } from '../utils/interface'

export interface ButtonProps {
  label?: string | number,

  color?: Color,
  size?: Size,
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

  name?: ButtonHTMLAttributes['name'],
  type?: ButtonHTMLAttributes['type'],

  tabindex?: ButtonHTMLAttributes['tabindex'],

  onClick?: (event: MouseEvent) => void,
  onMouseover?: (event: MouseEvent) => void,
  onMouseout?: (event: MouseEvent) => void
}
