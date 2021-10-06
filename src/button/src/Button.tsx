import { PropType, defineComponent, h } from 'vue'

import { GIcon, GProgress } from 'g-components'

export const name = 'g-button'

export default defineComponent({
  name,

  props: {
    label: {
      type: [ String, Number ],
      default: undefined
    },

    color: {
      type: String,
      default: undefined
    },

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

    icon: {
      type: String,
      default: undefined
    },
    prefix: {
      type: [ String, Number ],
      default: undefined
    },
    suffix: {
      type: [ String, Number ],
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
      type: Function as PropType<(e: MouseEvent) => void>,
      default: () => undefined
    }
  },

  setup(props, { slots }) {
    const clasess = {
      [`${name}`]: true,

      [`${name}--small`]: props.small,
      [`${name}--large`]: props.large,

      [`${name}--fab`]: props.fab,
      [`${name}--flat`]: props.flat,
      [`${name}--block`]: props.block,
      [`${name}--round`]: props.round ? true : (!!props.icon || !!props.prefix || !!props.suffix) && !props.label,
      [`${name}--rounded`]: props.rounded,
      [`${name}--outline`]: props.outline,
      [`${name}--depressed`]: props.depressed,

      [`${name}--prefix`]: props.prefix || props.icon,
      [`${name}--suffix`]: props.suffix,

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
    const renderIconHolder = (icon: string) => {
      if (props.icon) {
        const size = props.small ? 18 : props.large ? 26 : props.fab ? 30 : 22

        return <div class={[ `${name}__icon` ]}>
          <GIcon value={icon} size={size} />
        </div>
      }
    }

    return () => <button
      tabindex={props.tabindex}

      disabled={props.disabled}
      autofocus={props.autofocus}

      name={props.name}
      type={props.type}

      class={clasess}

      onClick={props.onClick}

      v-slots={slots}
    >
      <div v-if={props.loading} class={[ `${name}__loading` ]}>
        <GProgress indeterminate={true} size={24}></GProgress>
      </div>

      <renderIconHolder icon={props.prefix || props.icon} />
      <div v-if={props.label}>{props.label}</div>
      <renderIconHolder icon={props.suffix} />

      {{ dialog: () => slots.dialog ? slots.dialog() : undefined }}
    </button>
  }
})
