import { PropType, TransitionGroup, computed, defineComponent, h } from 'vue'

import { GSnackbar } from '..'
import { Direction } from '../../utils'
import { SnackbarProps } from '../interface'

export const name = 'g-snackbar-group'

export default defineComponent({
  name,

  props: {
    items: {
      type: Array as PropType<SnackbarProps[]>,
      default: () => []
    },

    directions: {
      type: Array as PropType<Direction[]>,
      default: () => [ 'bottom', 'left' ]
    }
  },

  setup(props) {
    const renderItems = () => {
      return props.items.map((item, index) => <GSnackbar {...item} key={`${name}-item-${index}`} />)
    }
    const renderContent = () => {
      return <TransitionGroup name='show-snackbar'>{renderItems()}</TransitionGroup>
    }

    const classes = computed<string[]>(() => {
      const result = [ name ]
      props.directions.reduce<string[]>((accumulator, currentValue) => {
        accumulator.push(`${name}--${currentValue}`)

        return accumulator
      }, result)

      return result
    })

    return () => <div class={classes.value}>{renderContent()}</div>
  }
})
