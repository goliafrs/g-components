import { defineComponent, h } from 'vue'

import { GChip } from '../..'

export default defineComponent({
  setup() {
    return () => <div class='faic'>
      <GChip label='GChip' color='primary'></GChip>
      <GChip label='GChip' color='error' icon='clear'></GChip>
      <GChip label='GChip' color='success' icon='done'></GChip>
      <GChip label='GChip' color='success' icon='done' loading></GChip>
    </div>
  }
})
