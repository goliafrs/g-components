import { defineComponent, h, reactive } from 'vue'

import { GTextarea } from '../..'
import { sizes, styles } from '../../utils'

export default defineComponent({
  setup() {
    const proxy = reactive<Record<string, string>>({})

    return () => <div class='grid'>
      {
        [ undefined, ...styles ].map((style, index) => {
          return <div class='grid' style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {
              sizes.map(size => {
                return <GTextarea v-model={proxy[index]} size={size} style={style} label={style ? style : 'label'} placeholder='placeholder' hint='hint' rounded clearable grow />
              })
            }
          </div>
        })
      }
    </div>
  }
})
