import { defineComponent, h, ref } from 'vue'

import { GButton, GSnackbarGroup } from '../..'
import { SnackbarProps } from '../../snackbar/interface'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const items = ref<SnackbarProps[]>([])

    const getRandom = (max = 10) => Math.floor(Math.random() * max)
    const clickHandler = () => {
      items.value.push({
        title: `Title ${getRandom()}`,
        text: `Text ${getRandom()}`,
        color: 'success',
        rounded: true,
        cancelable: true,
        timeout: 10 * 1000
      })
    }

    return () => <div>
      <GButton label='add snackbar' flat rounded onClick={clickHandler} />
      <GSnackbarGroup v-model={items.value} />
    </div>
  }
})
