import { Color, Icon, Size } from '../utils/interface'

export interface SnackbarProps {
  key?: string,
  title?: string,
  text?: string,
  timeout?: number,
  rounded?: boolean,
  outline?: boolean,
  cancelable?: boolean,
  callback?: (value: any) => void,
  color?: Color,
  size?: Size,
  icon?: Icon,
}
