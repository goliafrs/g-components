import { PropType, defineComponent, h, ref } from 'vue'
import { GList } from '..'

import { GIcon } from '../../'

import { colors } from '../../utils'
import { icons } from '../../utils/icons'
import { Color, Icon } from '../../utils/interface'
import { ListItemProps } from '../interface'

export const name = 'g-list-item'

export default defineComponent({
  name,

  props: {
    label: {
      type: [ String, Number ],
      default: undefined
    },

    items: {
      type: Array as PropType<ListItemProps[]>,
      default: () => []
    },

    group: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hovered: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },
    icon: {
      type: String as PropType<Icon>,
      default: undefined,
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
    },

    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    }
  },

  setup(props, { slots }) {
    const proxy = ref(false)

    const clickHandler = (event: MouseEvent) => {
      if (props.group) {
        event.stopPropagation()
        proxy.value = !proxy.value
      }
    }

    const renderIcon = () => {
      if (props.icon) {
        return <div class={`${name}__holder`}>
          <GIcon value={props.icon} color={props.color || 'grey'} size={21} />
        </div>
      }
    }
    const renderLabel = () => {
      if (slots.default || props.label) {
        return <div class={`${name}__label`}>
          {slots.default ? slots.default() : props.label}
        </div>
      }
    }
    const renderArrow = () => {
      if (props.group) {
        return <div class={`${name}__holder`}>
          <GIcon value={proxy.value ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} color='grey' size={21} />
        </div>
      }
    }
    const renderContent = () => {
      if (props.group && proxy.value) {
        return <GList items={props.items} />
      }
    }

    return () => <div
      role='listitem'

      class={{
        [`${name}`]: true,

        [`${name}--link`]: props.link || props.onClick,
        [`${name}--dense`]: props.dense,
        [`${name}--group`]: props.group,
        [`${name}--active`]: props.active,
        [`${name}--hovered`]: props.hovered,
        [`${name}--disabled`]: props.disabled,

        [`${name}--${props.color}`]: !!props.color
      }}

      onClick={props.onClick}
    >
      <div class={`${name}__content`} onClick={clickHandler}>
        {renderIcon()}
        {renderLabel()}
        {renderArrow()}
      </div>

      {renderContent()}
    </div>
  }
})
