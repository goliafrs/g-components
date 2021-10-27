import { defineComponent, h } from 'vue'

import { GIcon } from '../..'
import { icons } from '../../utils'

export default defineComponent({
  setup() {
    const renderIcons = () => {
      return icons.map(icon => {
        return <span class='pa-2'><GIcon icon={icon}></GIcon></span>
      })
    }

    return () => <div>{renderIcons()}</div>
  }
})
