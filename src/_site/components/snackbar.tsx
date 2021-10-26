import { defineComponent, h, reactive } from 'vue'

import { GButton, GSnackbarGroup } from '../..'
import { SnackbarProps } from '../../snackbar/interface'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const items = reactive<SnackbarProps[]>([
      {
        title: 'Title',
        text: 'text',
        color: 'primary',
        rounded: true,
        outline: true,
        cancelable: true
      }
    ])

    const getRandom = (max = 10) => Math.floor(Math.random() * max)

    return () => <div>
      <GButton label='add snackbar' flat rounded onClick={() => items.push({
        title: `Title ${getRandom()}`,
        text: `Text ${getRandom()}`,
        color: 'success',
        rounded: true,
        cancelable: true
      })} />
      <GSnackbarGroup items={items} />
    </div>
  }
})
