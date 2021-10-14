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
    return () => <div class={{
      [`${name}`]: true,
      [`${name}--dense`]: props.dense
    }}>
      {slots.default ? slots.default() : null}
    </div>
  }
})
