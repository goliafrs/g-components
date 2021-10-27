import { Icon } from '../utils'

export interface TabProps {
  modelValue?: string,
  tabKey: string,
  title?: string,
  icon?: Icon
}
export interface TabContentProps {
  tabKey: string,
  content: any
}
export interface TabsItems {
  header: TabProps[],
  body: TabContentProps[]
}
