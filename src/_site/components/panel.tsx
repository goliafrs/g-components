import { defineComponent, h } from 'vue'

import { GPanel } from '../..'

export default defineComponent({
  setup() {
    return () => <GPanel v-slots={{ header: () => <div>panel header</div> }}>panel 1</GPanel>
  }
})
