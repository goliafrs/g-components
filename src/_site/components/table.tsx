import { defineComponent, h } from 'vue'

import { GTable } from '../..'

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

    return () => <GTable items={[]} headers={headers} v-slots={slots}></GTable>
  }
})
