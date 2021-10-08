import { StyleValue, defineComponent, h } from 'vue'

import { normalizedValue, numberToPxOrString } from '../../utils'

export const name = 'g-progress'

export default defineComponent({
  name,

  props: {
    value: {
      type: Number,
      default: undefined
    },

    type: {
      type: String,
      default: 'circular'
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
      type: String,
      default: 'primary'
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
    const classes = {
      [`${name}`]: true,

      [`${name}-${props.type}`]: true,
      [`${name}-${props.type}--indeterminate`]: props.indeterminate,

      [`${name}--${props.color}`]: !!props.color
    }

    const style: StyleValue = {}
    if (props.type === 'circular') {
      style.minHeight = numberToPxOrString(props.size)
      style.height = numberToPxOrString(props.size)
      style.minWidth = numberToPxOrString(props.size)
      style.width = numberToPxOrString(props.size)
    } else {
      style.minHeight = numberToPxOrString(props.size)
      style.height = numberToPxOrString(props.size)
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
            cx={viewBoxSizeDouble}
            cy={viewBoxSizeDouble}
            r={radius}
            stroke-width={Number(props.width) / +props.size * viewBoxSizeDouble}
            stroke-dasharray={Math.round(circumference * 1000) / 1000}
            stroke-dashoffset={(100 - normalizedValue(props.value || 0)) / 100 * circumference + 'px'}
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
          style={{ width: props.indeterminate ? `${props.value || 0}%` : undefined }}
        ></div>
      }
    }
    const renderInfo = () => {
      if (props.info) {
        return <div class={`${name}__info`}>{props.value}</div>
      }
    }

    return () => <div
      role='progressbar'

      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={props.indeterminate ? undefined : props.value}

      class={classes}
      style={style}
    >
      {renderCircular()}
      {renderLinear()}
      {renderInfo()}
    </div>
  }
})
