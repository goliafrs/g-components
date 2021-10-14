import { computed, defineComponent, h } from 'vue'

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
    const classes = computed(() => {
      return {
        [`${name}`]: true,

        [`${name}--${props.color}`]: !!props.color,

        [`fz-${props.size}`]: true
      }
    })

    return () => <i class={classes.value}>{slots.default ? slots.default() : props.value}</i>
  }
})
