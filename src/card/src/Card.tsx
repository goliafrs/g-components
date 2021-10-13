import { PropType, StyleValue, defineComponent, h, reactive } from 'vue'

import { Color, colors, numberToPxOrString } from '../../utils'

export const name = 'g-card'

export default defineComponent({
  name,

  props: {
    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: string): boolean => {
        return !!~colors.indexOf(value)
      }
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
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: string): boolean => {
        return !!~colors.indexOf(value)
      }
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
    },

    minHeight: {
      type: [ String, Number ],
      default: ''
    },
    maxHeight: {
      type: [ String, Number ],
      default: ''
    },
    height: {
      type: [ String, Number ],
      default: ''
    },
    minWidth: {
      type: [ String, Number ],
      default: ''
    },
    maxWidth: {
      type: [ String, Number ],
      default: ''
    },
    width: {
      type: [ String, Number ],
      default: ''
    }
  },

  setup(props, { slots }) {
    const classes = reactive({
      [`${name}`]: true,

      [`${name}--${props.color}`]: !!props.color,

      [`${name}--flat`]: props.flat,
      [`${name}--outline`]: props.outline,
      [`${name}--hover`]: props.hover,
      [`${name}--rounded`]: props.rounded,
      [`${name}--transparent`]: props.transparent,

      [`${name}--accent-${props.accentColor}`]: !!props.accentColor,
      [`${name}--accent-${props.accentSize}`]: !!props.accentSize,
      [`${name}--accent-${props.accentPosition}`]: !!props.accentPosition
    })
    const style: StyleValue = reactive({
      minHeight: numberToPxOrString(props.minHeight),
      maxHeight: numberToPxOrString(props.maxHeight),
      height: numberToPxOrString(props.height),
      minWidth: numberToPxOrString(props.minWidth),
      maxWidth: numberToPxOrString(props.maxWidth),
      width: numberToPxOrString(props.width)
    })

    return () => <div class={classes} style={style}>
      {slots.default ? slots.default() : null}
    </div>
  }
})
