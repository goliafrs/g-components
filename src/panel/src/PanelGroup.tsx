import { PropType, defineComponent, h, provide, ref } from 'vue'

import { panelGroupInjection } from '../utils'

export const name = 'g-panel-group'

export default defineComponent({
  name,

  props: {
    flat: Boolean,
    outline: Boolean,
    rounded: Boolean,
    accordion: Boolean,

    defaultExpanded: {
      type: Array as PropType<(string | number)[]>,
      default: () => []
    }
  },

  setup(props, { slots }) {
    const expandedPanels = ref(props.defaultExpanded)

    const togglePanel = (panelRef: string | number, expanded: boolean): void => {
      if (props.accordion) {
        expandedPanels.value = expandedPanels.value.splice(0, -1)
        if (!expanded) {
          expandedPanels.value.push(panelRef)
        }
      } else {
        const index = expandedPanels.value.findIndex(panel => panelRef === panel)
        if (~index) {
          expandedPanels.value.splice(index, 1)
        } else {
          expandedPanels.value.push(panelRef)
        }
      }
    }

    provide(panelGroupInjection, {
      expandedPanels,
      togglePanel
    })

    return () => <div
      class={{
        [name]: true,

        [`${name}--${props.flat}`]: props.flat,
        [`${name}--${props.outline}`]: props.outline,
        [`${name}--${props.rounded}`]: props.rounded
      }}
    >
      {slots.default ? slots.default() : undefined}
    </div>
  }
})
