import { PropType, computed, defineComponent, h, ref } from 'vue'

import { GIcon, GProgress } from 'g-components'

import { Color, colors } from '../../utils'

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

    tiny: Boolean,
    small: Boolean,
    large: Boolean,

    fab: Boolean,
    flat: Boolean,
    block: Boolean,
    round: Boolean,
    rounded: Boolean,
    toolbar: Boolean,
    outline: Boolean,
    depressed: Boolean,
    marginless: Boolean,

    icon: {
      type: String,
      default: undefined
    },

    fixed: Boolean,
    absolute: Boolean,

    top: Boolean,
    bottom: Boolean,
    left: Boolean,
    right: Boolean,

    loading: Boolean,

    disabled: Boolean,
    autofocus: Boolean,

    name: {
      type: String,
      default: undefined
    },

    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },

    tabindex: {
      type: [ String, Number ],
      default: undefined
    },

    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: () => undefined
    },
    onMouseover: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: () => undefined
    },
    onMouseout: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: () => undefined
    }
  },

  setup(props, { slots }) {
    const classes = computed(() => {
      return {
        [`${name}`]: true,

        [`${name}--tiny`]: props.tiny,
        [`${name}--small`]: props.small,
        [`${name}--large`]: props.large,

        [`${name}--fab`]: props.fab,
        [`${name}--flat`]: props.flat,
        [`${name}--block`]: props.block,
        [`${name}--round`]: props.round ? true : !!props.icon && !props.label,
        [`${name}--rounded`]: props.rounded,
        [`${name}--outline`]: props.outline,
        [`${name}--depressed`]: props.depressed,
        [`${name}--marginless`]: props.marginless,

        [`${name}--toolbar`]: props.toolbar,

        [`${name}--fixed`]: props.fixed,
        [`${name}--absolute`]: props.absolute,

        [`${name}--top`]: props.top,
        [`${name}--bottom`]: props.bottom,
        [`${name}--left`]: props.left,
        [`${name}--right`]: props.right,

        [`${name}--disabled`]: props.disabled,
        [`${name}--loading`]: props.loading,

        [`${name}--${props.type}`]: !!props.type,
        [`${name}--${props.color}`]: !!props.color
      }
    })

    const size = computed(() => props.tiny ? 14 : props.small ? 18 : props.large ? 26 : props.fab ? 30 : 22)

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
          <GIcon value={props.icon} size={size.value} />
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
