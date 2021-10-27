import { PropType, Transition, computed, defineComponent, h } from 'vue'
import { GButton, GCardActions, GOverlay } from '../..'

import { Color, colors, numberToPxOrString } from '../../utils'

export const name = 'g-modal'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    zIndex: {
      type: Number,
      default: 7
    },

    title: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: undefined
    },

    positiveCallback: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    negativeCallback: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },

    positiveLabel: {
      type: String,
      default: 'ok'
    },
    negativeLabel: {
      type: String,
      default: 'cancel'
    },

    positiveColor: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },
    negativeColor: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },

    rounded: {
      type: Boolean,
      default: false
    },

    minHeight: {
      type: [ String, Number ],
      default: 0
    },
    maxHeight: {
      type: [ String, Number ],
      default: '400px'
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
      default: '400px'
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
        {slots.header ? slots.header() : props.title}
      </div>
    }
    const renderBody = () => {
      return <div class={`${name}__body`}>
        {slots.default ? slots.default() : props.text}
      </div>
    }
    const renderActions = () => {
      return <GCardActions class={`${name}__actions`}>
        <GButton
          label={props.positiveLabel}
          color={props.positiveColor}
          flat
          rounded
          onClick={(event: MouseEvent) => props.positiveCallback ? props.positiveCallback(event) : proxy.value = !proxy.value}
        />
        <GButton
          label={props.negativeLabel}
          color={props.negativeColor}
          flat
          rounded
          onClick={(event: MouseEvent) => props.negativeCallback ? props.negativeCallback(event) : proxy.value = !proxy.value}
        />
      </GCardActions>
    }
    const renderFooter = () => {
      return <div class={`${name}__footer`}>
        {slots.footer ? slots.footer() : renderActions()}
      </div>
    }
    const renderHolder = () => {
      return <div
        class={`${name}__holder`}

        style={{
          minHeight: numberToPxOrString(props.minHeight),
          maxHeight: numberToPxOrString(props.maxHeight),
          height: numberToPxOrString(props.height),
          minWidth: numberToPxOrString(props.minWidth),
          maxWidth: numberToPxOrString(props.maxWidth),
          width: numberToPxOrString(props.width)
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
            [`${name}--rounded`]: props.rounded
          }}

          style={{ zIndex: props.zIndex }}
        >
          {renderHolder()}

          <GOverlay v-model={proxy.value} closeOnClick={false} closeOnEsc={false} />
        </div>
      }
    }

    return () => <Transition name='show-modal'>{renderContent()}</Transition>
  }
})
