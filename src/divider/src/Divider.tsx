import { PropType, defineComponent, h } from 'vue'

import { colors } from '../../utils'
import { Color } from '../../utils/interface'

export const name = 'g-divider'

export type BorderStyle = 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'

export default defineComponent({
  name,

  props: {
    type: {
      type: String,
      default: 'horizontal',
      validator: (value: string): boolean => {
        return !!~[ 'horizontal', 'vertical' ].indexOf(value)
      }
    },
    style: {
      type: String as PropType<BorderStyle>,
      default: 'solid',
      validator: (value: string): boolean => {
        return !!~[ 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset' ].indexOf(value)
      }
    },
    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    }
  },

  setup(props) {
    return () => <div
      class={{
        [name]: true,

        [`${name}--${props.color}`]: !!props.color,
        [`${name}--${props.style}`]: !!props.style,

        [`${name}--${props.type}`]: true
      }}
    ></div>
  }
})
