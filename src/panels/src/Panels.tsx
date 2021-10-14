import { defineComponent, h, nextTick, onMounted, onUpdated, ref } from 'vue'

export const name = 'g-panels'

export default defineComponent({
  name,

  props: {
    flat: Boolean,
    outline: Boolean,
    rounded: Boolean
  },

  setup(props, { slots }) {
    const events = ref()

    const toggle = () => {
      if (slots.default) {
        for (const node of slots.default()) {
          console.log(node)
        }
      }
    }

    onMounted(() => nextTick(toggle))
    onUpdated(() => nextTick(toggle))

    return () => <div
      class={{
        [name]: true,

        [`${name}--${props.flat}`]: props.flat,
        [`${name}--${props.outline}`]: props.outline,
        [`${name}--${props.rounded}`]: props.rounded
      }}
    >
      {slots.default ? slots.default() : undefined}
    </div>
  }
})
