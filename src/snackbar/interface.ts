import { Color, Icon, Size } from '../utils/interface'

export interface SnackbarProps {
  title?: string,
  text?: string,
  rounded?: boolean,
  outline?: boolean,
  cancelable?: boolean,
  color?: Color,
  size?: Size,
  icon?: Icon,
}
