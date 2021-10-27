import { PropType, defineComponent, h, ref } from 'vue'

import { GTabsBody, GTabsHeader } from '..'
import { TabsItems } from '../interface'

export const name = 'g-tabs'

export default defineComponent({
  name,

  props: {
    items: {
      type: Object as PropType<TabsItems>,
      default: () => ({})
    }
  },

  setup(props) {
    const proxy = ref(props.items.header[0]?.tabKey)

    const renderHeader = () => {
      return <GTabsHeader v-model={proxy.value} items={props.items.header} />
    }
    const renderBody = () => {
      return <GTabsBody v-model={proxy.value} items={props.items.body} />
    }

    return () => <div class={name}>
      {renderHeader()}
      {renderBody()}
    </div>
  }
})
