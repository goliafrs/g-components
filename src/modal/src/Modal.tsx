import { PropType, Transition, defineComponent, h, onMounted, ref, watch } from 'vue'
import { GButton, GCardActions } from '../..'

import { Color, colors, numberToPxOrString } from '../../utils'

export const name = 'g-modal'

export default defineComponent({
  name,

  props: {
    rootElement: {
      type: null,
      default: '#app'
    },

    modelValue: {
      type: Boolean,
      default: false
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
    const rootElement = ref<HTMLElement>(document.querySelector(props.rootElement))
    const rootRef = ref<HTMLElement>()
    const proxy = ref(props.modelValue)

    const show = () => {
      proxy.value = true
    }
    const hide = () => {
      proxy.value = false
    }
    const toggle = () => {
      proxy.value ? hide() : show()
      emit('update:modelValue', proxy.value)
    }
    const setOverflow = () => {
      if (proxy.value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }

    watch(
      () => props.modelValue,
      () => {
        proxy.value = props.modelValue
        setOverflow()
      }
    )

    onMounted(() => {
      if (rootRef.value) {
        if (rootElement.value) {
          rootElement.value.insertBefore(rootRef.value, null)
        }
      }
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
          onClick={(event: MouseEvent) => props.positiveCallback ? props.positiveCallback(event) : toggle()}
        />
        <GButton
          label={props.negativeLabel}
          color={props.negativeColor}
          flat
          rounded
          onClick={(event: MouseEvent) => props.negativeCallback ? props.negativeCallback(event) : toggle()}
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
    const renderOverlay = () => {
      return <div class={`${name}__overlay`}></div>
    }
    const renderContent = () => {
      if (proxy.value) {
        return <div
          class={{
            [`${name}`]: true,
            [`${name}--rounded`]: props.rounded
          }}
        >
          {renderHolder()}
          {renderOverlay()}
        </div>
      }
    }

    return () => <Transition name='show-modal'>{renderContent()}</Transition>
  }
})
