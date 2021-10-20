import { defineComponent, h, ref } from 'vue'

import { GCheckbox } from '../..'

export default defineComponent({
  setup() {
    const proxy = ref(false)

    return () => <div>
      <GCheckbox v-model={proxy.value}>GCheckbox</GCheckbox>
      <GCheckbox v-model={proxy.value} color='success'>GCheckbox</GCheckbox>
    </div>
  }
})
