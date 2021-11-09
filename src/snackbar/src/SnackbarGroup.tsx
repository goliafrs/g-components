import { PropType, TransitionGroup, computed, defineComponent, h, ref, watch } from 'vue'

import { GSnackbar } from '..'
import { Direction } from '../../utils'
import { SnackbarProps } from '../interface'

export const name = 'g-snackbar-group'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: Array as PropType<SnackbarProps[]>,
      default: () => []
    },

    directions: {
      type: Array as PropType<Direction[]>,
      default: () => [ 'bottom', 'left' ]
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const proxy = computed<SnackbarProps[]>({
      get: () => props.modelValue.map((item, index) => {
        const key = item.key || `snackbar-${index}`
        if (!item.key) {
          item.key = key
        }
        if (!item.callback) {
          item.callback = () => remove(key)
        }

        return item
      }),
      set: value => emit('update:modelValue', value)
    })
    const classes = computed<string[]>(() => {
      return props.directions.reduce<string[]>((accumulator, currentValue) => {
        accumulator.push(`${name}--${currentValue}`)

        return accumulator
      }, [ name ])
    })

    const remove = (key: string | undefined): void => {
      const items = proxy.value
      const index = proxy.value.findIndex(item => item.key === key)
      items.splice(index, 1)
      proxy.value = items
    }

    const renderItems = () => {
      return proxy.value.map(item => <GSnackbar {...item} onTimeout={item.callback} />)
    }
    const renderContent = () => {
      return <TransitionGroup name='show-snackbar'>{renderItems()}</TransitionGroup>
    }

    return () => <div class={classes.value}>{renderContent()}</div>
  }
})
