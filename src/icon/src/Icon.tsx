import { defineComponent, h, reactive } from 'vue'

export const name = 'g-icon'

export default defineComponent({
  name,

  props: {
    value: {
      type: String,
      default: '',
      required: true
    },

    size: {
      type: Number,
      default: 24
    },

    color: {
      type: String,
      default: undefined
    }
  },

  setup(props, { slots }) {
    const classes = reactive({
      [`${name}`]: true,

      [`${name}--${props.color}`]: !!props.color,

      [`fz-${props.size}`]: true
    })

    return () => <i class={classes}>{slots.default ? slots.default() : props.value}</i>
  }
})
