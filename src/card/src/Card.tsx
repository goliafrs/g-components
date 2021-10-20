import { CSSProperties, PropType, computed, defineComponent, h, reactive } from 'vue'

import { colors, directions, numberToPxOrString } from '../../utils'
import { Color, Direction } from '../../utils/interface'

export const name = 'g-card'

export default defineComponent({
  name,

  props: {
    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
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

    accent: {
      type: String as PropType<Direction>,
      default: undefined,
      validator: (value: Direction): boolean => {
        return !!~directions.indexOf(value)
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
    const classes = computed(() => {
      return {
        [name]: true,

        [`${name}--${props.color}`]: !!props.color,

        [`${name}--flat`]: props.flat,
        [`${name}--outline`]: props.outline,
        [`${name}--hover`]: props.hover,
        [`${name}--rounded`]: props.rounded,

        [`${name}--accent-${props.accent}`]: !!props.accent
      }
    })
    const style = computed<CSSProperties>(() => {
      return {
        minHeight: numberToPxOrString(props.minHeight),
        maxHeight: numberToPxOrString(props.maxHeight),
        height: numberToPxOrString(props.height),
        minWidth: numberToPxOrString(props.minWidth),
        maxWidth: numberToPxOrString(props.maxWidth),
        width: numberToPxOrString(props.width)
      }
    })

    return () => <div class={classes.value} style={style.value}>
      {slots.default ? slots.default() : null}
    </div>
  }
})
