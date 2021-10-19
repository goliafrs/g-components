import { Color, Icon } from '../utils/interface'

export interface ListItemProps {
  label?: string | number,
  active?: boolean,
  disabled?: boolean,
  hovered?: boolean,
  link?: boolean,
  dense?: boolean,
  color?: Color,
  icon?: Icon,
  onClick?: (event: MouseEvent) => void
}
