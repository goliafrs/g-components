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
    }
  },

  setup(props, { slots }) {
    const classes = {
      [`${name}`]: true,

      [`${name}--small`]: props.small,
      [`${name}--large`]: props.large,

      [`${name}--fab`]: props.fab,
      [`${name}--flat`]: props.flat,
      [`${name}--block`]: props.block,
      [`${name}--round`]: props.round ? true : !!props.icon && !props.label,
      [`${name}--rounded`]: props.rounded,
      [`${name}--outline`]: props.outline,
      [`${name}--depressed`]: props.depressed,

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

    const size: number = props.small ? 18 : props.large ? 26 : props.fab ? 30 : 22

    // const renderLoading = () => {
    //   if (props.loading) {
    //     return <div class={[ `${name}__loading` ]}>
    //       <GProgress indeterminate={true} size={24}></GProgress>
    //     </div>
    //   }
    // }
    // const renderIcon = () => {
    //   if (props.icon) {
    //     return <div class={[ `${name}__icon` ]}>
    //       <GIcon value={props.icon} size={size} />
    //     </div>
    //   }
    // }
    // const renderLabel = () => {
    //   if (props.label) {
    //     return <div class={[ `${name}__content` ]}>{props.label}</div>
    //   } else if (slots.default) {
    //     return { default: slots.default() }
    //   }
    // }
    // const renderDialog = () => {
    //   if (slots.dialog) {
    //     return { dialog: slots.dialog() }
    //   }
    // }

    return {
      classes,
      size

      // renderLoading,
      // renderIcon,
      // renderLabel,
      // renderDialog
    }
  },

  render() {
    return (
      <button
        tabindex={this.tabindex}

        disabled={this.disabled}
        autofocus={this.autofocus}

        name={this.name}
        type={this.type}

        class={this.classes}

        onClick={this.onClick}
      >
        {this.loading ? <div class={[ `${name}__loading` ]}><GProgress indeterminate={true} size={24}></GProgress></div> : null}
        {this.icon ? <div class={[ `${name}__icon` ]}><GIcon value={this.icon} size={this.size} /></div> : null}
        {this.label ? <div class={[ `${name}__content` ]}>{this.label}</div> : this.$slots.default ? this.$slots.default() : null}
        {this.$slots.dialog ? this.$slots.dialog() : null}
      </button>
    )
  }
})
