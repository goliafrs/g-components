import { PropType, computed, defineComponent, h } from 'vue'

import { GIcon, GProgress } from '../../'

import { colors } from '../../utils'
import { icons } from '../../utils/icons'
import { Color, Icon } from '../../utils/interface'

export const name = 'g-chip'

export default defineComponent({
  name,

  props: {
    value: {
      type: null,
      default: undefined
    },

    label: {
      type: [ String, Number ],
      default: undefined
    },

    cut: Boolean,
    link: Boolean,

    length: {
      type: Number,
      default: 25
    },

    outline: Boolean,
    circle: Boolean,

    tiny: Boolean,
    small: Boolean,
    large: Boolean,

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },
    icon: {
      type: String as PropType<Icon>,
      default: undefined,
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
    },

    loading: Boolean,
    disabled: Boolean,

    cancelable: Boolean,
    cancelIcon: {
      type: String as PropType<Icon>,
      default: 'clear',
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
    },
    cancelCallback: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: () => undefined
    },

    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    }
  },

  setup(props) {
    const classes = computed(() => {
      return {
        [name]: true,

        [`${name}--tiny`]: props.tiny,
        [`${name}--small`]: props.small,
        [`${name}--large`]: props.large,

        [`${name}--circle`]: props.circle,
        [`${name}--outline`]: props.outline,

        [`${name}--icon`]: props.icon,

        [`${name}--cancelable`]: props.cancelable,

        [`${name}--link`]: props.link || !!props.onClick,

        [`${name}--loading`]: props.loading,
        [`${name}--disabled`]: props.disabled,

        [`${name}--${props.color}`]: !!props.color
      }
    })

    const size = computed(() => props.tiny ? 14 : props.small ? 18 : props.large ? 26 : 22)

    const renderLoading = () => {
      if (props.loading) {
        return <div class={`${name}__loading`}>
          <GProgress indeterminate width={1} size={size.value - 4}></GProgress>
        </div>
      }
    }
    const renderIcon = () => {
      if (props.icon) {
        return <div class={`${name}__holder`}>
          <GIcon value={props.icon} size={size.value}></GIcon>
        </div>
      }
    }
    const renderContent = () => {
      let content: string = props.label + ''
      if (props.cut && content.length > props.length) {
        content = content.substring(0, props.length) + '...'
      }

      return <div class={`${name}__content`}>{content}</div>
    }
    const renderCancelable = () => {
      if (props.cancelable) {
        return <div class={`${name}__holder`} onClick={props.cancelCallback}>
          <GIcon value={props.cancelIcon} size={size.value} color={props.color ? 'white' : undefined}></GIcon>
        </div>
      }
    }

    return () => <div class={classes.value} onClick={props.onClick}>
      {renderLoading()}
      {renderIcon()}
      {renderContent()}
      {renderCancelable()}
    </div>
  }
})
