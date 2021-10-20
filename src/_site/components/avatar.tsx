import { defineComponent, h } from 'vue'

import { GAvatar } from '../..'

export default defineComponent({
  setup() {
    return () => <div
      class='grid grid-gap--8'
      style={{ gridTemplateColumns: 'repeat(auto-fill, 48px)' }}
    >
      <GAvatar title='avatar' color='primary'></GAvatar>
      <GAvatar title='avatar' color='error' rounded></GAvatar>
      <GAvatar title='avatar' color='success' round></GAvatar>
      <GAvatar title='avatar' color='secondary' round outline></GAvatar>
    </div>
  }
})
