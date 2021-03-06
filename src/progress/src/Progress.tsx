import { CSSProperties, PropType, computed, defineComponent, h } from 'vue'

import { Color, colors, normalizedValue, numberToPxOrString } from '../../utils'
import { ProgressType } from '../interface'

export const name = 'g-progress'

export default defineComponent({
  name,

  props: {
    value: {
      type: Number,
      default: undefined
    },

    type: {
      type: String as PropType<ProgressType>,
      default: 'circular',
      validator: (value: ProgressType): boolean => {
        return !!~[ 'circular', 'linear' ].indexOf(value)
      }
    },

    size: {
      type: Number,
      default: 32
    },

    height: {
      type: Number,
      default: 2
    },
    width: {
      type: Number,
      default: 2
    },

    rotate: {
      type: Number,
      default: 0
    },

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },

    indeterminate: {
      type: Boolean,
      default: false
    },
    info: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const classes = computed(() => {
      return {
        [name]: true,

        [`${name}-${props.type}`]: true,
        [`${name}-${props.type}--indeterminate`]: props.indeterminate,

        [`${name}--${props.color}`]: !!props.color
      }
    })

    const style = computed<CSSProperties>(() => {
      return {} as CSSProperties
    })
    if (props.type === 'circular') {
      style.value.minHeight = numberToPxOrString(props.size)
      style.value.height = numberToPxOrString(props.size)
      style.value.minWidth = numberToPxOrString(props.size)
      style.value.width = numberToPxOrString(props.size)
    } else {
      style.value.minHeight = numberToPxOrString(props.height)
      style.value.height = numberToPxOrString(props.height)
    }

    const renderCircular = () => {
      if (props.type === 'circular') {
        const radius = 20
        const viewBoxSize = radius / (1 - Number(props.width) / +props.size)
        const viewBoxSizeDouble = viewBoxSize * 2
        const viewBox = `${viewBoxSize} ${viewBoxSize} ${viewBoxSizeDouble} ${viewBoxSizeDouble}`
        const circumference = 2 * Math.PI * radius

        return <svg xmlns='http://www.w3.org/2000/svg' viewBox={viewBox} style={{ transform: `rotate(${Number(props.rotate)}deg)` }}>
          <circle
            fill='transparent'

            r={radius}
            cx={viewBoxSizeDouble}
            cy={viewBoxSizeDouble}

            stroke-width={Number(props.width) / +props.size * viewBoxSizeDouble}
            stroke-dasharray={Math.round(circumference * 1000) / 1000}
            stroke-dashoffset={(100 - normalizedValue(props.value || 0)) / 100 * circumference + 'px'}

            class={`${name}-circular__circle`}
          ></circle>
        </svg>
      }
    }
    const renderLinear = () => {
      if (props.type === 'linear') {
        return <div
          class={{
            [`${name}-linear__bar`]: true,
            [`${name}-linear__bar--determinate`]: props.value
          }}
          style={{ width: !props.indeterminate ? `${props.value || 0}%` : undefined }}
        ></div>
      }
    }
    const renderInfo = () => {
      if (props.info && !props.indeterminate) {
        return <div class={`${name}__info`}>{props.value}</div>
      }
    }

    return () => <div
      role='progressbar'

      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={props.indeterminate ? undefined : props.value}

      class={classes.value}
      style={style.value}
    >
      {renderCircular()}
      {renderLinear()}
      {renderInfo()}
    </div>
  }
})
