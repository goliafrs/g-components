import { defineComponent, h } from 'vue'

export const name = 'g-tab-content'

export default defineComponent({
  name,

  setup(props, { slots }) {
    return () => <div class={name}>
      {slots.default ? slots.default() : undefined}
    </div>
  }
})
