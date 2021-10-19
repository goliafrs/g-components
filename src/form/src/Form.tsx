import { FormHTMLAttributes, PropType, defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'

export const name = 'g-footer'

export default defineComponent({
  name,

  props: {
    action: {
      type: String as PropType<FormHTMLAttributes['action']>,
      default: undefined
    },
    acceptcharset: {
      type: String as PropType<FormHTMLAttributes['acceptcharset']>,
      default: undefined
    },
    autocomplete: {
      type: String as PropType<FormHTMLAttributes['autocomplete']>,
      default: undefined
    },
    enctype: {
      type: String as PropType<FormHTMLAttributes['enctype']>,
      default: 'application/x-www-form-urlencoded'
    },
    method: {
      type: String as PropType<FormHTMLAttributes['method']>,
      default: undefined
    },
    name: {
      type: String as PropType<FormHTMLAttributes['name']>,
      default: undefined
    },
    target: {
      type: String as PropType<FormHTMLAttributes['target']>,
      default: '_self'
    },

    novalidate: {
      type: Boolean as PropType<FormHTMLAttributes['novalidate']>,
      default: true
    }
  },

  emits: [ 'validation' ],

  setup(props, { slots, emit }) {
    const rootRef = ref<HTMLFormElement>()

    const checkFormValidity = () => {
      emit('validation', rootRef.value?.checkValidity())
    }

    onMounted(() => {
      rootRef.value?.addEventListener('valuechange', checkFormValidity)
    })
    onBeforeUnmount(() => {
      rootRef.value?.removeEventListener('valuechange', checkFormValidity)
    })

    return () => <form
      action={props.action}
      acceptcharset={props.acceptcharset}
      autocomplete={props.autocomplete}
      enctype={props.enctype}
      method={props.method}
      name={props.name}
      target={props.target}
      novalidate={props.novalidate}

      ref={rootRef}
    >
      {slots.default ? slots.default() : undefined}
    </form>
  }
})
