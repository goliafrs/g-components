import { PropType, computed, defineComponent, h } from 'vue'

import { GIcon, GProgress } from '../../'

import { Color, Icon, Size, colors, icons, sizes } from '../../utils'

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

    size: {
      type: String as PropType<Size>,
      default: undefined,
      validator: (value: Size): boolean => {
        return !!~sizes.indexOf(value)
      }
    },
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
    callback: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
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

        [`${name}--circle`]: props.circle,
        [`${name}--outline`]: props.outline,

        [`${name}--icon`]: props.icon,

        [`${name}--cancelable`]: props.cancelable,

        [`${name}--link`]: props.link || !!props.onClick,

        [`${name}--loading`]: props.loading,
        [`${name}--disabled`]: props.disabled,

        [`${name}--${props.color}`]: !!props.color,
        [`${name}--${props.size}`]: !!props.size
      }
    })

    const size = computed<number>(() => {
      switch (props.size) {
        case 'tiny': { return 14 }
        case 'small': { return 18 }
        case 'large': { return 26 }
        case 'giant': { return 30 }
        case 'medium':
        default: { return 22 }
      }
    })
    const loading = computed<boolean>({
      get: () => props.loading,
      set: (value: boolean): boolean => loading.value = value
    })

    const getLabel = () => {
      let label: string = props.label + ''
      if (props.cut && label.length > props.length) {
        label = label.substring(0, props.length) + '...'
      }

      return label
    }
    const clickHandler = (event: MouseEvent) => {
      if (props.callback) {
        loading.value = true
        props.callback(event)
        loading.value = false
      }
    }

    const renderLoading = () => {
      if (props.loading) {
        return <div class={`${name}__loading`}>
          <GProgress indeterminate width={1} size={size.value - 4}></GProgress>
        </div>
      }
    }
    const renderIcon = () => {
      if (props.icon) {
        return <div class={`${name}__icon`}>
          <GIcon icon={props.icon} size={size.value}></GIcon>
        </div>
      }
    }
    const renderContent = () => {
      return <div class={`${name}__content`}>{getLabel()}</div>
    }
    const renderCancelable = () => {
      if (props.cancelable) {
        return <div class={`${name}__icon`} onClick={clickHandler}>
          <GIcon icon='clear' size={size.value} color={props.color ? 'white' : undefined}></GIcon>
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
