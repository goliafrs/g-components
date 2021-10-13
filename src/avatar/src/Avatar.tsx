import { PropType, StyleValue, defineComponent, h, reactive } from 'vue'

import { GIcon } from 'g-components'

import { Color, colors, numberToPxOrString } from '../../utils'

export const name = 'g-avatar'

export default defineComponent({
  name,

  props: {
    title: {
      type: String,
      default: undefined
    },

    src: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: undefined
    },

    size: {
      type: Number,
      default: 48
    },

    round: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: string): boolean => {
        return !!~colors.indexOf(value)
      }
    },

    background: {
      type: String,
      default: undefined
    },

    fontSize: {
      type: Number,
      default: 24
    }
  },

  setup(props, { slots }) {
    let firstChar = ''
    if (props.title) {
      firstChar = props.title.charAt(0)
    }

    let charCode
    if (firstChar) {
      charCode = parseInt(firstChar.charCodeAt(0) + '')
    }

    let defaultBackground
    if (charCode) {
      const defaultColors = [
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#9E9E9E',
        '#607D8B'
      ]
      defaultBackground = defaultColors[charCode % defaultColors.length]
    }

    const classes = reactive({
      [`${name}`]: true,

      [`${name}--round`]: props.round,
      [`${name}--rounded`]: props.rounded,
      [`${name}--outline`]: props.outline,

      [`${name}--${props.color}`]: !!props.color
    })
    const style: StyleValue = reactive({
      minHeight: numberToPxOrString(props.size),
      maxHeight: numberToPxOrString(props.size),
      height: numberToPxOrString(props.size),
      minWidth: numberToPxOrString(props.size),
      maxWidth: numberToPxOrString(props.size),
      width: numberToPxOrString(props.size)
    })
    if (!props.color) {
      const background = props.background || defaultBackground
      if (props.outline) {
        style.borderColor = background
      } else {
        style.backgroundColor = background
      }
    }

    const renderContent = () => {
      if (props.src) {
        return <img class={`${name}__img`} src={props.src} alt={props.title} />
      } else if (props.icon) {
        return <GIcon value={props.icon} color={props.color} size={props.fontSize} />
      }

      return <div class={`${name}__text`} style={{ fontSize: numberToPxOrString(props.fontSize) }}>{slots.default ? slots.default() : firstChar}</div>
    }

    return () => <div class={classes} style={style}>
      {renderContent()}
    </div>
  }
})
