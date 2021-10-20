import { defineComponent, h } from 'vue'

import { GButton } from '../..'

export default defineComponent({
  setup() {
    return () => <div
      class='grid grid-gap--8'
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 150px))' }}
    >
      <GButton color='primary'>normal</GButton>
      <GButton color='error' rounded>rounded</GButton>
      <GButton color='success' rounded depressed>depressed</GButton>
      <GButton color='accent' rounded outline>outline</GButton>
      <GButton color='black' rounded flat>flat</GButton>
    </div>
  }
})
