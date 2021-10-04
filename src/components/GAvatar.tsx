import { defineComponent } from 'vue'

import { numberToPxOrString } from '../utils'

const name = 'g-avatar'

const colors = [
  '#E53935',
  '#D81B60',
  '#9C27B0',
  '#5E35B1',
  '#43A047',
  '#E65100',
  '#F4511E',
  '#FF3D00',
  '#F50057',
  '#D500F9',
  '#FF1744'
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
    const style = {
      'background-color': props.background || defaultBackground,
      'min-height': numberToPxOrString(props.size),
      'max-height': numberToPxOrString(props.size),
      height: numberToPxOrString(props.size),
      'min-width': numberToPxOrString(props.size),
      'max-width': numberToPxOrString(props.size),
      width: numberToPxOrString(props.size)
    }

    const renderContent = () => {
      if (props.src) {
        return <img src={props.src} alt={props.title} />
      } else if (props.icon) {
        return <GIcon value={props.icon} color={props.color} size={props.fontSize}></GIcon>
      } else if (firstChar) {
        return <span class={`fz--${props.fontSize}`}>{firstChar}</span>
      }

      return { default: () => slots.default ? slots.default() : undefined }
    }

    return () => <div class={classes} style={style}>
      <renderContent />
    </div>
  }
})
