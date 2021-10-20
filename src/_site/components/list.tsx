import { defineComponent, h } from 'vue'

import { GCard, GList } from '../..'

export default defineComponent({
  setup() {
    return () => <div
      class='grid faifs'
      style={{ gridTemplateColumns: '300px 300px' }}
    >
      <GCard width={300}>
        <GList
          items={[
            { label: 'item 1' },
            { label: 'item 2' },
            {
              label: 'item 3',
              group: true,
              items: [
                { label: 'item 1' },
                { label: 'item 2' },
                {
                  label: 'item 3',
                  group: true,
                  items: [
                    { label: 'item 1' },
                    { label: 'item 2' }
                  ]
                }
              ]
            },
            { label: 'item 4' }
          ]}
        ></GList>
      </GCard>
      <GCard width={300}>
        <GList
          items={[
            { label: 'item 1' },
            { label: 'item 2' },
            {
              label: 'item 3',
              group: true,
              items: [
                { label: 'item 1' },
                { label: 'item 2' },
                {
                  label: 'item 3',
                  group: true,
                  items: [
                    { label: 'item 1' },
                    { label: 'item 2' }
                  ]
                }
              ]
            },
            { label: 'item 4' }
          ]}
          dense
        ></GList>
      </GCard>
    </div>
  }
})
