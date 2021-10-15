import { computed, defineComponent, getCurrentInstance, h, nextTick, onMounted, ref } from 'vue'

export const name = 'g-panel'

export default defineComponent({
  name,

  props: {
    preventClick: Boolean,
    expandOnMounted: Boolean
  },

  emits: [ 'mounted', 'toggle' ],

  setup(props, { emit, slots, expose }) {
    const uid = getCurrentInstance()?.uid

    const expanded = ref(false)

    const payload = computed(() => {
      return {
        expanded: expanded.value,
        toggle
      }
    })

    const toggle = () => {
      expanded.value = !expanded.value
      emit('toggle', payload.value)
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

      nextTick(() => {
        emit('mounted', payload.value)
      })
    })

    const renderHeader = () => {
      return <div class={`${name}__header`} onClick={headerOnClickHandler}>
        {slots.header ? slots.header(payload.value) : undefined}
      </div>
    }
    const renderBody = () => {
      if (expanded.value) {
        return <div class={`${name}__body`}>
          {slots.default ? slots.default(payload.value) : undefined}
        </div>
      }
    }

    expose({ toggle })

    return () => <div
      class={name}

      key={`${name}-${uid}`}
    >
      {renderHeader()}
      {renderBody()}
    </div>
  }
})
