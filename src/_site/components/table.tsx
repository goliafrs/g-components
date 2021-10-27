import { defineComponent, h } from 'vue'

import { GTable } from '../..'
import { sizes } from '../../utils'

export default defineComponent({
  setup() {
    const headers = [
      {
        title: 'Title',
        value: 'title',
        align: 'left',
        sortable: true
      },
      {
        title: 'Text',
        value: 'text'
      }
    ]
    const items = [
      {
        title: 'Title',
        text: 'Lorem ipsum'
      },
      {
        title: 'Title',
        text: 'Lorem ipsum'
      }
    ]
    const slots = {
      item: (item: any) => <tr>
        <td>{item.title}</td>
        <td>{item.text}</td>
      </tr>
    }

    return () => <div class='grid'>
      {
        sizes.map(size => <GTable items={items} headers={headers} size={size} v-slots={slots} outline rounded></GTable>)
      }
    </div>
  }
})
