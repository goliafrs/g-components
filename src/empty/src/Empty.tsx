import { PropType, defineComponent, h } from 'vue'

import { GIcon } from '../../'

import { Color, colors } from '../../utils'

export const name = 'g-empty'

export default defineComponent({
  name,

  props: {
    icon: {
      type: String,
      default: 'search_off'
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
