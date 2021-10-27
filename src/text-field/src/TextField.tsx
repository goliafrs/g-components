import { PropType, computed, defineComponent, h } from 'vue'

import { GInput } from '../..'
import { Color, Size, Style, colors, sizes, styles } from '../../utils'

export const name = 'g-text-field'

export default defineComponent({
  name,

  extends: GInput,

  props: {
    label: {
      type: String,
      default: undefined
    },

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },
    style: {
      type: String as PropType<Style>,
      default: undefined,
      validator: (value: Style): boolean => {
        return !!~styles.indexOf(value)
      }
    },
    size: {
      type: String as PropType<Size>,
      default: undefined,
      validator: (value: Size): boolean => {
        return !!~sizes.indexOf(value)
      }
    }
  },

  setup(props) {
    const label = computed<string>(() => [ props.label, props.required && '*' ].filter(item => !!item).join(' '))
    const labelShown = computed<boolean>(() => {
      if (!props.label) {
        return false
      }

      switch (props.style) {
        case 'box':
        case 'solo':
        case 'outline': {
          return !search.value || !selection.value.length
        }
        default: {
          return true
        }
      }
    })

    const renderLabel = () => {

    }

    return <div></div>
  }
})
