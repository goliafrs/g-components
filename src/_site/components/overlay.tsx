import { defineComponent, h, ref } from 'vue'

import { GButton, GOverlay } from '../..'

export default defineComponent({
  setup() {
    const proxy = ref(false)

    return () => <div>
      <GButton label='show overlay' onClick={() => proxy.value = true} />
      <GOverlay v-model={proxy.value} />
    </div>
  }
})
