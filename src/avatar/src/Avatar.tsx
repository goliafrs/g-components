import { CSSProperties, PropType, StyleValue, computed, defineComponent, h } from 'vue'

import { GIcon } from '../../'

import { Color, Icon, colors, icons, numberToPxOrString } from '../../utils'

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

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },
    icon: {
      type: String as PropType<Icon>,
      default: undefined,
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
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

    let defaultBackground: string
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

    const classes = computed(() => {
      return {
        [name]: true,

        [`${name}--round`]: props.round,
        [`${name}--rounded`]: props.rounded,
        [`${name}--outline`]: props.outline,

        [`${name}--${props.color}`]: !!props.color
      }
    })
    const style = computed<CSSProperties>((): CSSProperties => {
      return {
        borderColor: !props.color && props.outline ? props.background || defaultBackground : undefined,
        backgroundColor: !props.color ? props.background || defaultBackground : undefined,
        minHeight: numberToPxOrString(props.size),
        maxHeight: numberToPxOrString(props.size),
        height: numberToPxOrString(props.size),
        minWidth: numberToPxOrString(props.size),
        maxWidth: numberToPxOrString(props.size),
        width: numberToPxOrString(props.size)
      }
    })

    const renderContent = () => {
      if (props.src) {
        return <img class={`${name}__img`} src={props.src} alt={props.title} />
      } else if (props.icon) {
        return <GIcon icon={props.icon} color={props.color} size={props.fontSize} />
      }

      return <div
        class={`${name}__text`}
        style={{ fontSize: numberToPxOrString(props.fontSize) }}
      >
        {slots.default ? slots.default() : firstChar}
      </div>
    }

    return () => <div class={classes.value} style={style.value}>
      {renderContent()}
    </div>
  }
})
