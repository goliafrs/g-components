import { StyleValue, defineComponent, h } from 'vue'

import { GIcon } from 'g-components'

import { numberToPxOrString } from '../../utils'

export const name = 'g-avatar'

export const colors = [
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

    tile: {
      type: Boolean,
      default: false
    },

    color: {
      type: String,
      default: undefined
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
      defaultBackground = colors[charCode % colors.length]
    }

    const classes = {
      [`${name}`]: true,
      [`${name}--tile`]: props.tile,
      [`${name}--${props.color}`]: !!props.color
    }
    const style: StyleValue = {
      backgroundColor: !props.color && (props.background || defaultBackground) || undefined,
      minHeight: numberToPxOrString(props.size),
      maxHeight: numberToPxOrString(props.size),
      height: numberToPxOrString(props.size),
      minWidth: numberToPxOrString(props.size),
      maxWidth: numberToPxOrString(props.size),
      width: numberToPxOrString(props.size)
    }

    const renderContent = () => {
      if (props.src) {
        return <img class={`${name}__img`} src={props.src} alt={props.title} />
      } else if (props.icon) {
        return <GIcon value={props.icon} color={props.color} size={props.fontSize}></GIcon>
      } else if (firstChar) {
        return <span style={`font-size: ${props.fontSize}px`}>{firstChar}</span>
      }

      return slots.default ? slots.default() : null
    }

    return () => <div class={classes} style={style}>
      {renderContent()}
    </div>
  }
})
