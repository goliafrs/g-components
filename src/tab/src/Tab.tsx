import { PropType, computed, defineComponent, h } from 'vue'
import { GIcon } from '../..'

import { Icon, icons } from '../../utils'

export const name = 'g-tab'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: String,
      default: undefined
    },
    tabKey: {
      type: String,
      default: undefined
    },
    title: {
      type: String,
      default: undefined
    },

    icon: {
      type: String as PropType<Icon>,
      default: undefined,
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { slots, emit }) {
    const renderIcon = () => {
      if (props.icon) {
        return <div class={`${name}__icon`}>
          <GIcon icon={props.icon} />
        </div>
      }
    }
    const renderTitle = () => {
      if (slots.default || props.title) {
        return <div class={`${name}__title`}>
          {slots.default ? slots.default() : props.title}
        </div>
      }
    }

    return () => <div
      class={{
        [name]: true,
        [`${name}--icon`]: !!props.icon,
        [`${name}--active`]: props.modelValue === props.tabKey
      }}
      onClick={() => emit('update:modelValue', props.tabKey)}
      key={props.tabKey}
    >
      {renderIcon()}
      {renderTitle()}
    </div>
  }
})
