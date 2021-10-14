import { PropType, computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { Color, colors, numberToPxOrString } from '../../utils'

export const name = 'g-dialog'

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

    fullscreen: {
      type: Boolean,
      default: false
    },
    fullscreenMobile: {
      type: Boolean,
      default: true
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

    close: {
      type: Boolean,
      default: false
    },

    align: {
      type: String,
      default: 'center',
      validator: (value: string): boolean => {
        return !!~[ 'top', 'bottom', 'left', 'right', 'center' ].indexOf(value)
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
    const rootElement = ref<HTMLElement>(document.querySelector(props.rootElement))
    const rootRef = ref<HTMLElement>()
    const proxy = ref(props.modelValue)

    const viewportWidth = computed<number>({
      get: () => window.innerWidth,
      set: (value: number) => viewportWidth.value = value
    })
    const isFullscreen = computed<boolean>(() => {
      return props.fullscreen || viewportWidth.value < 768 && props.fullscreenMobile
    })

    const show = () => {
      proxy.value = true
      emit('update:modelValue', proxy.value)
    }
    const hide = () => {
      proxy.value = false
      emit('update:modelValue', proxy.value)
    }
    const toggle = () => {
      proxy.value ? hide() : show()
    }
    const setOverflow = () => {
      if (proxy.value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    const escHandler = (event: KeyboardEvent) => {
      if (props.closeOnEsc && ~[ 'Esc', 'Escape' ].indexOf(event.key)) {
        hide()
      }
    }
    const viewportWidthHandler = () => viewportWidth.value = window.innerWidth

    watch(
      () => props.modelValue,
      () => {
        proxy.value = props.modelValue
        setOverflow()
      }
    )

    onMounted(() => {
      window.addEventListener('resize', viewportWidthHandler)
      if (rootRef.value) {
        if (rootElement.value) {
          rootElement.value.insertBefore(rootRef.value, null)
        }
        rootRef.value.addEventListener('keyup', escHandler)
      }
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', viewportWidthHandler)
      if (rootRef.value) {
        rootRef.value.removeEventListener('keyup', escHandler)
      }
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
          maxHeight: isFullscreen.value ? props.maxHeight : '600px',
          height: isFullscreen.value ? '100%' : props.height
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
          minHeight: isFullscreen.value ? '100%' : numberToPxOrString(props.minHeight),
          maxHeight: isFullscreen.value ? '100%' : numberToPxOrString(props.maxHeight),
          height: isFullscreen.value ? '100%' : numberToPxOrString(props.height),
          minWidth: isFullscreen.value ? '100%' : numberToPxOrString(props.minWidth),
          maxWidth: isFullscreen.value ? '100%' : numberToPxOrString(props.maxWidth),
          width: isFullscreen.value ? '100%' : numberToPxOrString(props.width)
        }}
      >
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </div>
    }
    const renderOverlay = () => {
      return <div class={`${name}__overlay`} onClick={() => hide()}></div>
    }
    const renderContent = () => {
      return <div
        v-show={proxy.value}

        class={{
          [`${name}`]: true,

          [`${name}--scroll`]: props.scroll,
          [`${name}--rounded`]: props.rounded,
          [`${name}--overflow`]: props.overflow,

          [`${name}__align--${props.align}`]: true,

          'show-dialog': true
        }}

        style={{ zIndex: props.zIndex }}
      >
        {renderHolder()}
        {renderOverlay()}
      </div>
    }

    // FIXME: [Vue warn]: Failed to resolve component: transition
    return () => <transition>
      {renderContent()}
    </transition>
  }
})
