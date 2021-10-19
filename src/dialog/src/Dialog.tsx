import { PropType, Transition, computed, defineComponent, h } from 'vue'
import { GOverlay } from '../..'

import { directions, numberToPxOrString } from '../../utils'
import { Direction } from '../../utils/interface'

export const name = 'g-dialog'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    fullscreen: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 7
    },
    overflow: {
      type: Boolean,
      default: false
    },
    scroll: {
      type: Boolean,
      default: false
    },

    closeOnClick: {
      type: Boolean,
      default: true
    },
    closeOnEsc: {
      type: Boolean,
      default: true
    },

    rounded: {
      type: Boolean,
      default: false
    },

    direction: {
      type: String as PropType<Direction>,
      default: 'center',
      validator: (value: Direction): boolean => {
        return !!~directions.indexOf(value)
      }
    },

    minHeight: {
      type: [ String, Number ],
      default: 0
    },
    maxHeight: {
      type: [ String, Number ],
      default: 'none'
    },
    height: {
      type: [ String, Number ],
      default: 'auto'
    },
    minWidth: {
      type: [ String, Number ],
      default: 0
    },
    maxWidth: {
      type: [ String, Number ],
      default: 'none'
    },
    width: {
      type: [ String, Number ],
      default: '100%'
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit, slots }) {
    const proxy = computed<boolean>({
      get: () => props.modelValue,
      set: (value: boolean) => emit('update:modelValue', value)
    })

    const renderHeader = () => {
      return <div class={`${name}__header`}>
        {slots.header ? slots.header() : undefined}
      </div>
    }
    const renderBody = () => {
      return <div
        class={`${name}__body`}

        style={{
          minHeight: props.minHeight,
          maxHeight: props.fullscreen ? props.maxHeight : '600px',
          height: props.fullscreen ? '100%' : props.height
        }}
      >
        {slots.default ? slots.default() : undefined}
      </div>
    }
    const renderFooter = () => {
      return <div class={`${name}__footer`}>
        {slots.footer ? slots.footer() : undefined}
      </div>
    }
    const renderHolder = () => {
      return <div
        class={`${name}__holder`}

        style={{
          minHeight: props.fullscreen ? '100%' : numberToPxOrString(props.minHeight),
          maxHeight: props.fullscreen ? '100%' : numberToPxOrString(props.maxHeight),
          height: props.fullscreen ? '100%' : numberToPxOrString(props.height),
          minWidth: props.fullscreen ? '100%' : numberToPxOrString(props.minWidth),
          maxWidth: props.fullscreen ? '100%' : numberToPxOrString(props.maxWidth),
          width: props.fullscreen ? '100%' : numberToPxOrString(props.width)
        }}
      >
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </div>
    }
    const renderContent = () => {
      if (proxy.value) {
        return <div
          class={{
            [name]: true,

            [`${name}--scroll`]: props.scroll,
            [`${name}--rounded`]: props.rounded,
            [`${name}--overflow`]: props.overflow,

            [`${name}--${props.direction}`]: !!props.direction
          }}

          style={{ zIndex: props.zIndex }}
        >
          {renderHolder()}

          <GOverlay v-model={proxy.value} closeOnClick={props.closeOnClick} closeOnEsc={props.closeOnEsc} />
        </div>
      }
    }

    return () => <Transition name='show-dialog'>{renderContent()}</Transition>
  }
})
