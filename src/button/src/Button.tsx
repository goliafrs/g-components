import { ButtonHTMLAttributes, PropType, computed, defineComponent, h } from 'vue'

import { GIcon, GProgress } from '../../'

import { Color, Direction, Icon, Position, Size, colors, directions, icons, positions, sizes } from '../../utils'

export const name = 'g-button'

export default defineComponent({
  name,

  props: {
    label: {
      type: [ String, Number ],
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
    },
    position: {
      type: String as PropType<Position>,
      default: undefined,
      validator: (value: Position): boolean => {
        return !!~positions.indexOf(value)
      }
    },
    direction: {
      type: String as PropType<Direction>,
      default: undefined,
      validator: (value: Direction): boolean => {
        return !!~directions.indexOf(value)
      }
    },

    fab: Boolean,
    flat: Boolean,
    block: Boolean,
    round: Boolean,
    rounded: Boolean,
    toolbar: Boolean,
    outline: Boolean,
    depressed: Boolean,

    loading: Boolean,

    disabled: Boolean,
    autofocus: Boolean,

    name: {
      type: String as PropType<ButtonHTMLAttributes['name']>,
      default: undefined
    },
    type: {
      type: String as PropType<ButtonHTMLAttributes['type']>,
      default: undefined
    },

    tabindex: {
      type: Number as PropType<ButtonHTMLAttributes['tabindex']>,
      default: undefined
    },

    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMouseover: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMouseout: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    }
  },

  setup(props, { slots }) {
    const classes = computed(() => {
      return {
        [name]: true,

        [`${name}--fab`]: props.fab,
        [`${name}--flat`]: props.flat,
        [`${name}--block`]: props.block,
        [`${name}--round`]: props.round ? true : !!props.icon && !props.label,
        [`${name}--rounded`]: props.rounded,
        [`${name}--toolbar`]: props.toolbar,
        [`${name}--outline`]: props.outline,
        [`${name}--depressed`]: props.depressed,

        [`${name}--loading`]: props.loading,
        [`${name}--disabled`]: props.disabled,

        [`${name}--${props.type}`]: !!props.type,
        [`${name}--${props.color}`]: !!props.color,
        [`${name}--${props.size}`]: !!props.size,
        [`${name}--${props.position}`]: !!props.position,
        [`${name}--${props.direction}`]: !!props.direction
      }
    })

    const size = computed<number>(() => {
      if (props.fab) {
        return 30
      }

      switch (props.size) {
        case 'tiny': { return 14 }
        case 'small': { return 18 }
        case 'large': { return 26 }
        case 'giant': { return 30 }
        case 'medium':
        default: { return 22 }
      }
    })

    const renderLoading = () => {
      if (props.loading) {
        return <div class={`${name}__loading`}>
          <GProgress indeterminate size={size.value + 2}></GProgress>
        </div>
      }
    }
    const renderIcon = () => {
      if (props.icon) {
        return <div class={`${name}__icon`}>
          <GIcon icon={props.icon} size={size.value} />
        </div>
      }
    }
    const renderLabel = () => {
      if (slots.default || props.label) {
        return <div class={`${name}__content`}>
          {slots.default ? slots.default() : props.label}
        </div>
      }
    }
    const renderDialog = () => {
      if (slots.dialog) {
        return slots.dialog()
      }
    }

    return () => <button
      tabindex={props.tabindex}

      disabled={props.disabled}
      autofocus={props.autofocus}

      name={props.name}
      type={props.type}

      class={classes.value}

      onClick={props.onClick}
      onMouseover={props.onMouseover}
      onMouseout={props.onMouseout}
    >
      {renderLoading()}
      {renderIcon()}
      {renderLabel()}
      {renderDialog()}
    </button>
  }
})
