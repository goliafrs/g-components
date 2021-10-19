import { computed, defineComponent, getCurrentInstance, h, inject, onMounted, ref } from 'vue'
import { expandedPanelsInjection } from './PanelGroup'

export const name = 'g-panel'

export default defineComponent({
  name,

  props: {
    preventClick: Boolean,
    expandOnMounted: Boolean
  },

  setup(props, { slots }) {
    const uid = getCurrentInstance()?.uid

    const rootRef = ref(`${name}-${uid}`)

    const injectExpanded = inject(expandedPanelsInjection)

    const expanded = computed<boolean>(() => {
      if (injectExpanded) {
        return !!~injectExpanded.expandedPanels.value.findIndex(panel => panel === rootRef.value)
      }

      return false
    })

    const toggle = () => {
      injectExpanded?.togglePanel(rootRef.value, expanded.value)
    }
    const headerOnClickHandler = () => {
      if (!props.preventClick) {
        toggle()
      }
    }

    onMounted(() => {
      if (props.expandOnMounted) {
        toggle()
      }
    })

    const renderHeader = () => {
      return <div class={`${name}__header`} onClick={headerOnClickHandler}>
        {slots.header ? slots.header({ toggle }) : undefined}
      </div>
    }
    const renderBody = () => {
      if (expanded.value) {
        return <div class={`${name}__body`}>
          {slots.default ? slots.default({ toggle }) : undefined}
        </div>
      }
    }

    return () => <div class={name} key={`${name}-${uid}`} ref={rootRef.value}>
      {renderHeader()}
      {renderBody()}
    </div>
  }
})
