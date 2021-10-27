import { PropType, computed, defineComponent, h } from 'vue'

import { GTab } from '..'

import { TabProps } from '../interface'

export const name = 'g-tabs-header'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: String,
      default: undefined
    },

    items: {
      type: Array as PropType<TabProps[]>,
      default: () => []
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const proxy = computed<string | void>({
      get: () => props.modelValue,
      set: (value: string | void) => emit('update:modelValue', value)
    })

    const renderContent = () => {
      return <div class={`${name}__items`}>
        {props.items.map(item => <GTab v-model={proxy.value} {...item} />)}
      </div>
    }

    return () => <div class={name}>
      <div class={`${name}__holder`}>
        {renderContent()}
      </div>
    </div>
  }
})
