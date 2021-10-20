import { PropType, defineComponent, h } from 'vue'

import { GListItem } from '..'
import { ListItemProps } from '../interface'

export const name = 'g-list'

export default defineComponent({
  name,

  props: {
    items: {
      type: Array as PropType<ListItemProps[]>,
      default: () => []
    },

    wrap: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    nested: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { slots }) {
    const renderContent = () => {
      if (Array.isArray(props.items) && props.items.length) {
        return props.items.map((item: ListItemProps) => {
          return slots.item ? slots.item(item) : <GListItem {...item} />
        })
      }
    }

    return () => <div
      role='list'

      class={{
        [name]: true,

        [`${name}--wrap`]: props.wrap,
        [`${name}--dense`]: props.dense,
        [`${name}--rounded`]: props.rounded,
        [`${name}--nested`]: props.nested
      }}
    >
      {slots.default ? slots.default() : renderContent()}
    </div>
  }
})
