import { defineComponent, h } from 'vue'

import { GListItem } from '../..'

export default defineComponent({
  setup() {
    return () => <GListItem to={{ path: '/' }}>test</GListItem>
  }
})
