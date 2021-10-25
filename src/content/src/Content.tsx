import { defineComponent, h } from 'vue'

export const name = 'g-content'

export default defineComponent({
  name,

  setup(props, { slots }) {
    return () => <main id='content' class={name}>
      {slots.default ? slots.default() : undefined}
    </main>
  }
})
