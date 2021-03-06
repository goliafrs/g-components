import { PropType, defineComponent, h } from 'vue'

import { Color, Icon, colors, icons } from '../../utils'

export const name = 'g-icon'

export default defineComponent({
  name,

  props: {
    icon: {
      type: String as PropType<Icon>,
      default: undefined,
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
    },
    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },

    size: {
      type: Number,
      default: 24
    }
  },

  setup(props, { slots }) {
    if (slots.default || props.icon) {
      return () => <i
        class={{
          [name]: true,
          [`${name}--${props.color}`]: !!props.color
        }}

        style={{ fontSize: props.size + 'px' }}
      >
        {slots.default ? slots.default() : props.icon}
      </i>
    }
  }
})
