import { defineComponent, h } from 'vue'

import { GSpoiler } from '../..'

export default defineComponent({
  setup() {
    return () => <GSpoiler title='spoiler' text='text' />
  }
})
