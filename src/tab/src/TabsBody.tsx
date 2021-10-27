import { PropType, TransitionGroup, defineComponent, h } from 'vue'

import { GTabContent } from '..'
import { TabContentProps } from '../interface'

export const name = 'g-tabs-body'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: String,
      default: undefined
    },

    items: {
      type: Array as PropType<TabContentProps[]>,
      default: () => []
    }
  },

  setup(props) {
    const renderItems = () => {
      return props.items.map(item => {
        return <GTabContent v-show={item.tabKey === props.modelValue} key={item.tabKey}>{item.content}</GTabContent>
      })
    }
    const renderContent = () => {
      return <TransitionGroup name='show-tab'>{renderItems()}</TransitionGroup>
    }

    return () => <div class={name}>
      {renderContent()}
    </div>
  }
})
