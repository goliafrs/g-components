import { defineComponent, h, reactive } from 'vue'

export const name = 'g-icon'

export default defineComponent({
  name,

  props: {
    value: {
      type: String,
      default: undefined
    },

    size: {
      type: Number,
      default: 24
    },

    color: {
      type: String,
      default: undefined
    },

    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },

    library: {
      type: String,
      default: undefined
    }
  },

  setup(props) {
    const classes = reactive({
      [`${name}`]: true,

      [`${name}--left`]: props.left,
      [`${name}--right`]: props.right,

      [`${name}--${props.library}`]: !!props.library,
      [`${name}--${props.color}`]: !!props.color,

      [`${name}__icon--${props.value}`]: !!props.value,

      [`fz--${props.size}`]: true
    })

    return () => <i class={classes}></i>
  }
})
