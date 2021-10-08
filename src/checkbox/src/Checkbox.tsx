import { computed, defineComponent, getCurrentInstance, h, reactive, ref, watch } from 'vue'

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
      type: String,
      default: undefined
    },

    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { slots, emit }) {
    const uid = `${name}_${getCurrentInstance()?.uid}`

    const proxy = ref(props.modelValue)
    const checked = ref(false)

    watch(() => props.modelValue, () => {
      proxy.value = props.modelValue
      if (proxy.value === props.trueValue) {
        checked.value = true
      } else {
        checked.value = false
      }
    })

    const classes = reactive({
      [`${name}`]: true,

      [`${name}--checked`]: checked,
      [`${name}--disabled`]: props.disabled
    })

    const clickHandler = () => {
      if (!props.disabled) {
        if (proxy.value === props.falseValue) {
          proxy.value = props.trueValue
        } else {
          proxy.value = props.falseValue
        }
        emit('update:modelValue', proxy.value)
      }
    }

    const renderInput = () => {
      return <input type='checkbox' hidden name={uid} />
    }
    // TODO: добавить генерацию цветов на основании свойства props.color
    const renderContent = () => {
      return <div class={`${name}__holder`}>
        <div class={`${name}__background`}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class={`${name}__check-mark`}>
            <path d='M1.73 12.91 8.1 19.28 22.79 4.59' class={`${name}__check-mark__path`}></path>
          </svg>
        </div>
      </div>
    }
    const renderLabel = () => {
      if (slots.default || props.label) {
        return <label for={uid} class={`${name}__label`}>{slots.default ? slots.default() : props.label}</label>
      }
    }

    return () => <div role='checkbox' aria-checked={proxy.value} class={classes} onClick={clickHandler}>
      {renderInput()}
      {renderContent()}
      {renderLabel()}
    </div>
  }
})
