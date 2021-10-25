import { defineComponent, h, ref } from 'vue'

import { GButton } from '../..'

export default defineComponent({
  setup() {
    const proxy = ref<boolean>(false)

    return () => <GButton label='show sidebar' onClick={() => proxy.value = !proxy.value} />
  }
})
