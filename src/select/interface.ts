export type SelectTitle = 'title' | string
export type SelectValue = 'value' | string
export type SelectItem = Record<SelectTitle | SelectValue, string | number | boolean> | string | number | boolean

export interface SelectDisplayItem {
  label: string,
  hovered: boolean,
  selected: boolean,
  disabled: boolean,
  searchValid: boolean
}
