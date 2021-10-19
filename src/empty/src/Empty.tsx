import { PropType, defineComponent, h } from 'vue'

import { GIcon } from '../../'

import { colors } from '../../utils'
import { icons } from '../../utils/icons'
import { Color, Icon } from '../../utils/interface'

export const name = 'g-empty'

export default defineComponent({
  name,

  props: {
    icon: {
      type: String as PropType<Icon>,
      default: 'search_off',
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
    },

    title: {
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

    size: {
      type: Number,
      default: 64
    },

    padless: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const renderIcon = () => {
      return <GIcon value={props.icon} color={props.color} size={props.size} />
    }
    const renderTitle = () => {
      if (props.title) {
        return <div class={`${name}__title`}>{props.title}</div>
      }
    }

    return () => <div
      class={{
        [name]: true,
        [`${name}--padless`]: props.padless
      }}
    >
      {renderIcon()}
      {renderTitle()}
    </div>
  }
})
