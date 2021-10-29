import { PropType, Transition, computed, defineComponent, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export const name = 'g-overlay'

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

    closeOnClick: {
      type: Boolean,
      default: true
    },
    closeOnEsc: {
      type: Boolean,
      default: true
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const rootElement = ref<HTMLElement>(document.querySelector(props.rootElement))

    const proxy = computed<boolean>({
      get: () => props.modelValue,
      set: (value: boolean) => emit('update:modelValue', value)
    })

    const setOverflow = () => {
      if (proxy.value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    const clickHandler = (event: MouseEvent) => {
      if (props.closeOnClick) {
        proxy.value = false
      }
    }
    const escHandler = (event: KeyboardEvent) => {
      if (props.closeOnEsc && ~[ 'Esc', 'Escape' ].indexOf(event.key)) {
        proxy.value = false
      }
    }

    watch(() => proxy.value, setOverflow)

    onMounted(() => {
      rootElement.value.addEventListener('keyup', escHandler)
    })
    onBeforeUnmount(() => {
      rootElement.value.removeEventListener('keyup', escHandler)
    })

    const renderContent = () => {
      return <div v-show={proxy.value} class={name} onClick={clickHandler}></div>
    }

    return () => <Transition name='show-overlay'>{renderContent()}</Transition>
  }
})
