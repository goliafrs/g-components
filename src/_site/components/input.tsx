import { defineComponent, h, ref } from 'vue'

import { GCard, GInput } from '../..'

export default defineComponent({
  setup() {
    const proxy = ref()

    return () => <div class='grid grid-cols-1'>
      <GInput v-model:trim={proxy.value} placeholder='GInput' autofocus />
      <GCard outline rounded class='pa-3' width={300}><pre>{proxy.value}</pre></GCard>
    </div>
  }
})
