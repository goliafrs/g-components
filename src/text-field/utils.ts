import { Primitive } from '../utils'

export const stringToNumber = (value: string): number => parseFloat(value.replace(',', '.'))
export const filterJoinString = (strings: (void | Primitive)[]): string => strings.filter(value => !!value).join(' ')

export default {
  stringToNumber,
  filterJoinString
}
