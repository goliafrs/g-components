import { computed, defineComponent, getCurrentInstance, h } from 'vue'

export const name = 'g-switch'

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
        [`${name}--disabled`]: props.disabled
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
    const renderRail = () => {
      return <div class={`${name}__rail`}>
        <div class={`${name}__thumb`}></div>
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
      {renderRail()}
      {renderLabel()}
    </div>
  }
})
