import { Primitive } from '../utils/interface'

export type SelectTitle = string | 'title'
export type SelectValue = string | 'value'
export type SelectItem = Record<SelectTitle | SelectValue, Primitive> | Primitive

export interface FormattedSelectItem {
  label?: string,
  value?: Primitive,
  hovered: boolean,
  selected: boolean,
  disabled: boolean,
  searchValid: boolean
}
