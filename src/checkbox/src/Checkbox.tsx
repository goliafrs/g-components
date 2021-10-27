import { PropType, computed, defineComponent, getCurrentInstance, h } from 'vue'

import { Color, colors } from '../../utils'

export const name = 'g-checkbox'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: null,
      default: false
    },

    label: {
      type: String,
      default: undefined
    },

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },

    trueValue: {
      type: [ Boolean, String, Number ],
      default: true
    },
    falseValue: {
      type: [ Boolean, String, Number ],
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { slots, emit }) {
    const uid = getCurrentInstance()?.uid

    const checked = computed<boolean>((): boolean => {
      if (proxy.value === props.falseValue) {
        return false
      } else {
        return true
      }
    })
    const proxy = computed<boolean | string | number>({
      get: () => props.modelValue,
      set: (value: boolean | string | number) => emit('update:modelValue', value)
    })

    const classes = computed(() => {
      return {
        [name]: true,

        [`${name}--checked`]: checked.value,
        [`${name}--disabled`]: props.disabled,

        [`${name}--${props.color}`]: !!props.color
      }
    })

    const clickHandler = () => {
      if (!props.disabled) {
        if (proxy.value === props.falseValue) {
          proxy.value = props.trueValue
        } else {
          proxy.value = props.falseValue
        }
      }
    }

    const renderInput = () => {
      return <input type='checkbox' name={`${name}-${uid}`} value={proxy.value} hidden />
    }
    const renderContent = () => {
      return <div class={`${name}__square`}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class={`${name}__check-mark`}>
          <path d='M1.73 12.91 8.1 19.28 22.79 4.59' class={`${name}__check-mark__path`}></path>
        </svg>
      </div>
    }
    const renderLabel = () => {
      if (slots.default || props.label) {
        return <label for={`${name}-${uid}`} class={`${name}__label`}>
          {slots.default ? slots.default() : props.label}
        </label>
      }
    }

    return () => <div
      role='checkbox'

      aria-checked={checked.value}
      class={classes.value}
      onClick={clickHandler}
    >
      {renderInput()}
      {renderContent()}
      {renderLabel()}
    </div>
  }
})
