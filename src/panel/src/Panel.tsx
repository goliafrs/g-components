import { computed, defineComponent, getCurrentInstance, h, inject, onMounted, ref } from 'vue'

import { panelGroupInjection } from '../utils'

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

    const injection = inject(panelGroupInjection, undefined)

    const expanded = computed<boolean>(() => {
      if (injection) {
        return !!~injection.expandedPanels.value.findIndex(panel => panel === rootRef.value)
      }

      return false
    })
    const localExpanded = ref(false)

    const toggle = () => {
      if (injection) {
        injection.togglePanel(rootRef.value, expanded.value)
      } else {
        localExpanded.value = !localExpanded.value
      }
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
        {slots.header ? slots.header() : undefined}
      </div>
    }
    const renderBody = () => {
      if (expanded.value || localExpanded.value) {
        return <div class={`${name}__body`}>
          {slots.default ? slots.default() : undefined}
        </div>
      }
    }

    return () => <div class={name} key={`${name}-${uid}`} ref={rootRef.value}>
      {renderHeader()}
      {renderBody()}
    </div>
  }
})
