import { PropType, defineComponent, h } from 'vue'
import { GButton, GIcon } from '../..'

import { Color, Icon, Size, colors, icons, sizes } from '../../utils'

export const name = 'g-snackbar'

export default defineComponent({
  name,

  props: {
    title: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: undefined
    },

    rounded: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    cancelable: {
      type: Boolean,
      default: false
    },

    callback: {
      type: Function as PropType<(event: MouseEvent) => void>,
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
      type: String as PropType<Size>,
      default: undefined,
      validator: (value: Size): boolean => {
        return !!~sizes.indexOf(value)
      }
    },
    icon: {
      type: String as PropType<Icon>,
      default: undefined,
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
    }
  },

  emits: [ 'hide' ],

  setup(props, { slots, emit }) {
    const renderIcon = () => {
      if (props.icon) {
        return <GIcon icon={props.icon} color={props.outline ? props.color : 'white'} />
      }
    }
    const renderTitle = () => {
      if (props.title) {
        return <div class={`${name}__title`}>{props.title}</div>
      }
    }
    const renderText = () => {
      if (slots.default || props.text) {
        return <div class={`${name}__text`}>{slots.default ? slots.default() : props.text}</div>
      }
    }
    const renderContent = () => {
      return <div class={`${name}__content`}>
        {renderTitle()}
        {renderText()}
      </div>
    }
    const renderActions = () => {
      if (props.cancelable) {
        return <div class={`${name}__actions`}>
          <GButton icon='clear' color={props.outline ? props.color : 'white'} onClick={props.callback} flat />
        </div>
      }
    }

    return () => <div
      class={{
        [name]: true,

        [`${name}--${props.color}`]: !!props.color,
        [`${name}--${props.size}`]: !!props.size,

        [`${name}--icon`]: !!props.icon,
        [`${name}--rounded`]: props.rounded,
        [`${name}--outline`]: props.outline,
        [`${name}--cancelable`]: props.cancelable
      }}
    >
      {renderIcon()}
      {renderContent()}
      {renderActions()}
    </div>
  }
})
