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
      }
    ]
    const width = 400

    return () => <div class='grid'>
      {
        styles.map(style => {
          return <div class='grid' style={{ gridTemplateColumns: 'repeat(5, 300px)' }}>
            {
              sizes.map(size => {
                return <GSelect v-model={proxy} items={items} size={size} style={style} label='GSelect' />
              })
            }
          </div>
        })
      }
    </div>
  }
})
