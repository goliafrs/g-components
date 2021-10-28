import { Primitive } from '../utils'

export const filterJoinString = (strings: (void | Primitive)[]): string => {
  return strings.filter(value => !!value).join(' ')
}

export default { filterJoinString }
