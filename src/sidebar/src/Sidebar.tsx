import { computed, defineComponent, h } from 'vue'
import { GOverlay } from '../..'

export const name = 'g-sidebar'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    mobile: {
      type: Boolean,
      default: false
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { slots, emit }) {
    const proxy = computed<boolean>({
      get: () => props.modelValue,
      set: (value: boolean) => emit('update:modelValue', value)
    })

    const renderOverlay = () => {
      if (props.mobile) {
        return <GOverlay v-model={proxy.value} />
      }
    }
    const renderContent = () => {
      return <div class={`${name}__content`}>{slots.default ? slots.default() : undefined}</div>
    }

    return () => <div
      class={{
        [name]: true,

        [`${name}--hide`]: !props.modelValue,
        [`${name}--mobile`]: props.mobile
      }}
    >
      {renderOverlay()}
      {renderContent()}
    </div>
  }
})
