import { PropType, defineComponent, h } from 'vue'

import { Color, colors } from '../../utils'

export const name = 'g-icon'

export default defineComponent({
  name,

  props: {
    value: {
      type: String,
      default: undefined,
      required: true
    },

    size: {
      type: Number,
      default: 24
    },

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    }
  },

  setup(props, { slots }) {
    if (props.value) {
      return () => <i
        class={{
          [`${name}`]: true,
          [`${name}--${props.color}`]: !!props.color
        }}

        style={{ fontSize: props.size + 'px' }}
      >
        {slots.default ? slots.default() : props.value}
      </i>
    }
  }
})
