import { PropType, defineComponent, h, ref } from 'vue'

import { GIcon } from 'g-components'

import { Color, colors } from '../../utils'

export const name = 'g-list-item'

export interface ListItem {
  label: string | number | undefined,
  active: boolean,
  disabled: boolean,
  hovered: boolean,
  link: boolean,
  dense: boolean,
  color: Color,
  icon: string,
  to: any
}

export default defineComponent({
  name,

  props: {
    label: {
      type: [ String, Number ],
      default: undefined
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
      default: true
    },
    dense: {
      type: Boolean,
      default: true
    },

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },

    icon: {
      type: String,
      default: undefined
    },

    to: {
      type: [ Object, String ],
      default: () => undefined
    },

    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: () => undefined
    }
  },

  setup(props, { slots }) {
    const component = ref('div')
    if (props.to) {
      component.value = 'router-link'
    }

    const renderIcon = () => {
      if (props.icon) {
        return <div class={`${name}__holder`}>
          <GIcon value={props.icon} color={props.color || 'grey'} size={21} />
        </div>
      }
    }
    const renderContent = () => {
      if (slots.default || props.label) {
        return <div class={`${name}__content`}>
          {slots.default ? slots.default() : props.label}
        </div>
      }
    }

    return () => <component
      role='listitem'

      class={{
        [`${name}`]: true,

        [`${name}--link`]: props.link,
        [`${name}--active`]: props.active,
        [`${name}--hovered`]: props.hovered,
        [`${name}--disabled`]: props.disabled,

        [`${name}--${props.color}`]: !!props.color
      }}

      to={props.to}

      onClick={props.onClick}
    >
      {renderIcon()}
      {renderContent()}
    </component>
  }
})
