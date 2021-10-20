import { defineComponent, h, ref } from 'vue'

import { GSwitch } from '../..'
import { colors } from '../../utils'

export default defineComponent({
  setup() {
    const proxy = ref(false)

    const renderSwitches = () => {
      return colors.map(color => {
        return <GSwitch v-model={proxy.value} color={color}></GSwitch>
      })
    }

    return () => <div>{renderSwitches()}</div>
  }
})
