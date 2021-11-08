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
    const proxy = computed<SnackbarProps[]>(() => props.modelValue.map((item, index) => {
      const key = item.key || `snackbar-${index}`
      if (!item.key) {
        item.key = key
      }
      if (!item.callback) {
        item.callback = () => remove(key)
      }

      return item
    }))
    const classes = computed<string[]>(() => {
      return props.directions.reduce<string[]>((accumulator, currentValue) => {
        accumulator.push(`${name}--${currentValue}`)

        return accumulator
      }, [ name ])
    })

    // FIXME: не работает
    const remove = (key: string | undefined): void => {
      console.log(proxy.value)
      const index = proxy.value.findIndex(item => item.key === key)
      console.log(index)
      proxy.value.splice(index, 1)
      console.log(proxy.value)
    }

    watch(
      () => proxy.value,
      () => {
        emit('update:modelValue', proxy.value)
        console.log('watch', proxy.value)
      },
      { deep: true }
    )

    const renderItems = () => {
      return proxy.value.map(item => <GSnackbar {...item} onTimeout={item.callback} />)
    }
    const renderContent = () => {
      return <TransitionGroup name='show-snackbar'>{renderItems()}</TransitionGroup>
    }

    return () => <div class={classes.value}>{renderContent()}</div>
  }
})
