import { defineComponent, h } from 'vue'

import { GCard } from '../..'

export default defineComponent({
  setup() {
    return () => <div>
      <GCard class='pa-3' width={300}>GCard</GCard>
      <GCard class='pa-3 ml-3' rounded width={300}>GCard</GCard>
      <GCard class='pa-3 ml-3' rounded outline width={300}>GCard</GCard>
      <GCard class='pa-3 ml-3' rounded flat color='primary' width={300}>GCard</GCard>
    </div>
  }
})
