import { defineComponent, h } from 'vue'

import { GPanel, GPanelGroup } from '../..'

export default defineComponent({
  setup() {
    return () => <div>
      <GPanelGroup accordion>
        {
          [ 1, 2, 3, 4 ].map(item => {
            const slots = { header: () => <div>panel header {item}</div> }

            return <GPanel v-slots={slots}>panel body {item}</GPanel>
          })
        }
      </GPanelGroup>
      <GPanelGroup accordion class='mt-3'>
        <GPanel v-slots={{ header: () => <div>panel header</div> }}>panel 1</GPanel>
        <GPanel v-slots={{ header: () => <div>panel header</div> }}>panel 2</GPanel>
        <GPanel v-slots={{ header: () => <div>panel header</div> }}>
          <GPanelGroup accordion>
            <GPanel v-slots={{ header: () => <div>panel header</div> }}>panel 1</GPanel>
            <GPanel v-slots={{ header: () => <div>panel header</div> }}>panel 2</GPanel>
          </GPanelGroup>
        </GPanel>
        <GPanel v-slots={{ header: () => <div>panel header</div> }}>panel 4</GPanel>
      </GPanelGroup>
    </div>
  }
})
