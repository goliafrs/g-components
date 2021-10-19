import { PropType, defineComponent, h } from 'vue'

import { colors } from '../../utils'
import { Color } from '../../utils/interface'

export const name = 'g-footer'

export default defineComponent({
  name,

  props: {
    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },

    dense: Boolean,
    fixed: Boolean
  },

  setup(props, { slots }) {
    return () => <div
      class={{
        [name]: true,

        [`${name}--dense`]: props.dense,
        [`${name}--fixed`]: props.fixed,

        [`${name}--${props.color}`]: !!props.color
      }}
    >
      {slots.default ? slots.default() : undefined}
    </div>
  }
})
