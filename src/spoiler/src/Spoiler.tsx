import { Transition, defineComponent, getCurrentInstance, h, ref } from 'vue'

export const name = 'g-spoiler'

export default defineComponent({
  name,

  props: {
    title: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: undefined
    }
  },

  setup(props, { slots }) {
    const uid = getCurrentInstance()?.uid

    const expanded = ref(false)

    const toggle = () => {
      expanded.value = !expanded.value
    }

    const renderHeader = () => {
      return <div class={`${name}__title`} onClick={toggle}>{props.title}</div>
    }
    const renderBody = () => {
      if (expanded.value) {
        return <div class={`${name}__text`}>{slots.default ? slots.default() : props.text}</div>
      }
    }

    return () => {
      if (props.title && props.text || slots.default) {
        return <div class={name} key={`${name}-${uid}`}>
          {renderHeader()}
          <Transition name='fade'>{renderBody()}</Transition>
        </div>
      }
    }
  }
})
