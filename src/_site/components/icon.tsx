import { defineComponent, h } from 'vue'

import { GIcon } from '../..'
import { icons } from '../../utils/icons'
import { Icon } from '../../utils/interface'

export default defineComponent({
  setup() {
    const renderIcons = () => {
      return icons.map((icon: Icon) => {
        return <span class='pa-2'><GIcon value={icon}></GIcon></span>
      })
    }

    return () => <div>{renderIcons()}</div>
  }
})
