import { defineComponent } from 'vue'

export const name = 'g-card'

export default defineComponent({
  name,

  props: {
    color: {
      type: String,
      default: undefined
    },

    flat: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    },

    accent: {
      type: Boolean,
      default: false
    },
    accentColor: {
      type: String,
      default: undefined
    },
    accentSize: {
      type: String,
      default: 'medium'
    },
    accentPosition: {
      type: String,
      default: 'left',
      validator: (value: string): boolean => {
        return !!~[ 'left', 'right', 'top', 'bottom' ].indexOf(value)
      }
    }
  },

  setup(props) {
    const classes = {
      [`${name}`]: true,

      [`${name}--flat`]: props.flat,
      [`${name}--outline`]: props.outline,
      [`${name}--hover`]: props.hover,
      [`${name}--rounded`]: props.rounded,
      [`${name}--transparent`]: props.transparent,

      [`${name}--accent-${props.accentColor}`]: !!props.accentColor,
      [`${name}--accent-${props.accentSize}`]: !!props.accentSize,
      [`${name}--accent-${props.accentPosition}`]: !!props.accentPosition
    }

    return () => <div class={classes}></div>
  }
})
