import { computed, defineComponent, h } from 'vue'

import { GButton } from '../..'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const proxy = computed<boolean>({
      get: () => props.modelValue,
      set: (value: boolean) => emit('update:modelValue', value)
    })

    return () => <div>
      <GButton label='show sidebar' onClick={() => proxy.value = !proxy.value} />
    </div>
  }
})
