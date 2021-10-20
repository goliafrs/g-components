import { defineComponent, h } from 'vue'

import { GFooter } from '../..'

export default defineComponent({
  setup() {
    return () => <div>
      <GFooter>GFooter</GFooter>
      <GFooter color='primary'>GFooter primary</GFooter>
      <GFooter color='error'>GFooter error</GFooter>
      <GFooter color='success'>GFooter success</GFooter>
      <GFooter fixed dense>GFooter fixed dense</GFooter>
    </div>
  }
})
