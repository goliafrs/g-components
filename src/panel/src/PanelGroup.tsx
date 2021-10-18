import { ComponentPublicInstance, DefineComponent, InjectionKey, PropType, Ref, VNode, VNodeChild, defineComponent, getCurrentInstance, h, nextTick, onMounted, onUpdated, provide, reactive, ref } from 'vue'

export const name = 'g-panel-group'

export interface ExpandedPanelsInjection {
  expandedPanels: Ref<(string | number)[]>,
  togglePanel: (panelRef: string | number, expanded: boolean) => void
}

export const expandedPanelsInjection: InjectionKey<ExpandedPanelsInjection> = Symbol('expanded')

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
      console.log(panelRef, expanded)
      if (props.accordion) {
        if (expanded) {
          expandedPanels.value.push(panelRef)
        } else {
          expandedPanels.value.slice()
        }
      } else {
        const activePanels = expandedPanels.value.slice()
        const index = activePanels.findIndex(panel => panelRef === panel)
        if (!index) {
          activePanels.splice(index, 1)
          expandedPanels.value.push(...activePanels)
        } else {
          activePanels.push(panelRef)
          expandedPanels.value.push(...activePanels)
        }
      }
    }

    provide(expandedPanelsInjection, {
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
