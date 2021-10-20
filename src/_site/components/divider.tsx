import { defineComponent, h } from 'vue'

import { GDivider } from '../..'

export default defineComponent({
  setup() {
    return () => <div>
      <GDivider />
      <GDivider color='primary' class='mt-3' />
      <GDivider color='error' style='dashed' class='mt-3' />
      <GDivider color='success' style='dotted' class='mt-3' />
    </div>
  }
})
