import { defineComponent, h } from 'vue'

import { GProgress } from '../..'

export default defineComponent({
  setup() {
    return () => <div class='grid grid-cols-1'>
      <div>
        <GProgress indeterminate color='primary' />
        <GProgress value={25} class='ml-3' color='error' />
        <GProgress value={50} class='ml-3' color='success' info />
      </div>
      <div class='grid grid-cols--1'>
        <GProgress indeterminate color='primary' type='linear' />
        <GProgress indeterminate color='error' type='linear' />
        <GProgress indeterminate color='success' type='linear' />
        <GProgress color='primary' type='linear' value={25} />
        <GProgress color='primary' type='linear' value={50} info />
      </div>
    </div>
  }
})
