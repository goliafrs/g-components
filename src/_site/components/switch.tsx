import { defineComponent, h, ref } from 'vue'

import { GSwitch } from '../..'
import { colors } from '../../utils'

export default defineComponent({
  setup() {
    const proxy = ref(false)

    return () => <div><GSwitch v-model={proxy.value}>GSwitch</GSwitch></div>
  }
})
