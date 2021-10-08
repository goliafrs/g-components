import { defineComponent, h } from 'vue'

export const name = 'g-card-actions'

export default defineComponent({
  name,

  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { slots }) {
    const classes = {
      [`${name}`]: true,

      [`${name}--dense`]: props.dense
    }

    return () => <div class={classes}>
      {slots.default ? slots.default() : null}
    </div>
  }
})
