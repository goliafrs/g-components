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
    const callback = (index: number): void => {
      items.splice(index, 1)
    }
    const items = reactive<SnackbarProps[]>([
      {
        title: 'Title',
        text: 'text',
        color: 'primary',
        rounded: true,
        outline: true,
        cancelable: true,
        callback
      }
    ])

    const getRandom = (max = 10) => Math.floor(Math.random() * max)

    return () => <div>
      <GButton label='add snackbar' flat rounded onClick={() => items.push({
        title: `Title ${getRandom()}`,
        text: `Text ${getRandom()}`,
        color: 'success',
        rounded: true,
        cancelable: true,
        callback: () => callback(items.length - 1)
      })} />
      <GSnackbarGroup items={items} />
    </div>
  }
})
