import { defineComponent, h, ref } from 'vue'

import { GButton, GModal } from '../..'

export default defineComponent({
  setup() {
    const proxy = ref(false)

    return () => <div>
      <GButton onClick={() => proxy.value = !proxy.value} label='show modal' rounded></GButton>
      <GModal v-model={proxy.value} rounded>
        <div class='pa-3'>Modal content.</div>
      </GModal>
    </div>
  }
})
