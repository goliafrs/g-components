import { defineComponent, h, ref } from 'vue'

import { GCard, GSelect } from '../..'
import { sizes, styles } from '../../utils'

export default defineComponent({
  setup() {
    const proxy = ref()
    const items = [
      {
        title: 'item 1',
        value: 'item1'
      },
      {
        title: 'item 2',
        value: 'item2'
      },
      {
        title: 'item 3',
        value: 'item3'
      },
      {
        title: 'item 4',
        value: 'item4'
      },
      {
        title: 'item 4',
        value: 'item4'
      },
      {
        title: 'item 4',
        value: 'item4'
      },
      {
        title: 'item 4',
        value: 'item4'
      },
      {
        title: 'item 4',
        value: 'item4'
      }
    ]

    return () => <div class='grid'>
      {
        [ undefined, ...styles ].map(style => {
          return <div class='grid' style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {
              sizes.map(size => {
                return <GSelect v-model={proxy} items={items} size={size} style={style} label={style ? style : 'label'} />
              })
            }
          </div>
        })
      }
    </div>
  }
})
