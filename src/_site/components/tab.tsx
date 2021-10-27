import { defineComponent, h } from 'vue'

import { GButton, GCard, GTabs } from '../..'

import { TabContentProps, TabProps } from '../../tab/interface'

export default defineComponent({
  setup() {
    const header: TabProps[] = [
      {
        tabKey: 'tab1',
        title: 'tab1'
      },
      {
        tabKey: 'tab2',
        title: 'tab2'
      },
      {
        tabKey: 'tab3',
        title: 'tab3'
      }
    ]
    const body: TabContentProps[] = [ 1, 2, 3 ].map(tab => {
      const tabKey = `tab${tab}`

      const content = <GCard outline class='pa-3'>
        <GButton label={tabKey}></GButton>
      </GCard>

      return {
        tabKey,
        content
      }
    })

    return () => <GTabs items={{
      header,
      body
    }} />
  }
})
