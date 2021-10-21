import { InputHTMLAttributes, PropType, computed, defineComponent, h } from 'vue'
import { CustomInputEvent, CustomInputEventCallback } from '../interface'
import { inputEvents } from '../utils'

export const name = 'g-input'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: null,
      default: undefined
    },

    id: {
      type: String as PropType<InputHTMLAttributes['id']>,
      default: undefined
    },
    accept: {
      type: String as PropType<InputHTMLAttributes['accept']>,
      default: undefined
    },
    alt: {
      type: String as PropType<InputHTMLAttributes['alt']>,
      default: undefined
    },
    autocomplete: {
      type: String as PropType<InputHTMLAttributes['autocomplete']>,
      default: undefined
    },
    list: {
      type: String as PropType<InputHTMLAttributes['list']>,
      default: undefined
    },
    form: {
      type: String as PropType<InputHTMLAttributes['form']>,
      default: undefined
    },
    formaction: {
      type: String as PropType<InputHTMLAttributes['formaction']>,
      default: undefined
    },
    formenctype: {
      type: String as PropType<InputHTMLAttributes['formenctype']>,
      default: undefined
    },
    formmethod: {
      type: String as PropType<InputHTMLAttributes['formmethod']>,
      default: undefined
    },
    formtarget: {
      type: String as PropType<InputHTMLAttributes['formtarget']>,
      default: undefined
    },
    name: {
      type: String as PropType<InputHTMLAttributes['name']>,
      default: undefined
    },
    pattern: {
      type: String as PropType<InputHTMLAttributes['pattern']>,
      default: undefined
    },
    placeholder: {
      type: String as PropType<InputHTMLAttributes['placeholder']>,
      default: undefined
    },
    src: {
      type: String as PropType<InputHTMLAttributes['src']>,
      default: undefined
    },
    type: {
      type: String as PropType<InputHTMLAttributes['type']>,
      default: undefined
    },

    height: {
      type: Number as PropType<InputHTMLAttributes['height']>,
      default: undefined
    },
    width: {
      type: Number as PropType<InputHTMLAttributes['width']>,
      default: undefined
    },
    min: {
      type: Number as PropType<InputHTMLAttributes['min']>,
      default: undefined
    },
    minlength: {
      type: Number as PropType<InputHTMLAttributes['minlength']>,
      default: undefined
    },
    max: {
      type: Number as PropType<InputHTMLAttributes['max']>,
      default: undefined
    },
    maxlength: {
      type: Number as PropType<InputHTMLAttributes['maxlength']>,
      default: undefined
    },
    step: {
      type: Number as PropType<InputHTMLAttributes['step']>,
      default: undefined
    },
    size: {
      type: Number as PropType<InputHTMLAttributes['size']>,
      default: undefined
    },
    tabindex: {
      type: Number as PropType<InputHTMLAttributes['tabindex']>,
      default: undefined
    },

    autofocus: {
      type: Boolean as PropType<InputHTMLAttributes['autofocus']>,
      default: undefined
    },
    checked: {
      type: Boolean as PropType<InputHTMLAttributes['checked']>,
      default: undefined
    },
    disabled: {
      type: Boolean as PropType<InputHTMLAttributes['disabled']>,
      default: undefined
    },
    formnovalidate: {
      type: Boolean as PropType<InputHTMLAttributes['formnovalidate']>,
      default: undefined
    },
    multiple: {
      type: Boolean as PropType<InputHTMLAttributes['multiple']>,
      default: undefined
    },
    readonly: {
      type: Boolean as PropType<InputHTMLAttributes['readonly']>,
      default: undefined
    },
    required: {
      type: Boolean as PropType<InputHTMLAttributes['required']>,
      default: undefined
    },
    spellcheck: {
      type: Boolean as PropType<InputHTMLAttributes['spellcheck']>,
      default: undefined
    },

    onChange: {
      type: Function as PropType<(event: CustomInputEvent) => void>,
      default: undefined
    },
    onPaste: {
      type: Function as PropType<(event: CustomInputEvent) => void>,
      default: undefined
    },
    onFocus: {
      type: Function as PropType<(event: FocusEvent) => void>,
      default: undefined
    },
    onFocusin: {
      type: Function as PropType<(event: FocusEvent) => void>,
      default: undefined
    },
    onFocusout: {
      type: Function as PropType<(event: FocusEvent) => void>,
      default: undefined
    },
    onBlur: {
      type: Function as PropType<(event: FocusEvent) => void>,
      default: undefined
    },
    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onDblclick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMouseup: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMousedown: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMouseenter: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMouseleave: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMouseout: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMouseover: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onMousemove: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined
    },
    onKeyup: {
      type: Function as PropType<(event: KeyboardEvent) => void>,
      default: undefined
    },
    onKeydown: {
      type: Function as PropType<(event: KeyboardEvent) => void>,
      default: undefined
    },
    onKeypress: {
      type: Function as PropType<(event: KeyboardEvent) => void>,
      default: undefined
    }
  },

  emits: [ 'update:modelValue', ...inputEvents ],

  setup(props, { emit }) {
    const proxy = computed<any>({
      get: () => props.modelValue,
      set: (value: any) => emit('update:modelValue', value)
    })
    const events = computed<any>(() => {
      return inputEvents.reduce<Record<string, CustomInputEventCallback>>((result, eventName) => {
        const eventNameProp = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1) as any

        if (props[eventNameProp]) {
          result[eventNameProp] = (event: any) => emit(eventName as CustomInputEvent, event)
        }

        return result
      }, {})
    })

    return () => <input
      class={name}

      {...props}
      {...events.value}

      value={proxy.value}

      onInput={(event: any) => proxy.value = event.target.value}
    />
  }
})