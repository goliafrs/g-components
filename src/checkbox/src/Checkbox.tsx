import { PropType, computed, defineComponent, getCurrentInstance, h, reactive, ref, watch } from 'vue'

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

    const checked = ref(false)
    const proxy = ref(props.modelValue)

    watch(
      () => props.modelValue,
      () => proxy.value = props.modelValue
    )

    const classes = computed(() => {
      return {
        [`${name}`]: true,

        [`${name}--checked`]: checked.value,
        [`${name}--disabled`]: props.disabled,

        [`${name}--${props.color}`]: !!props.color
      }
    })

    const clickHandler = () => {
      if (!props.disabled) {
        if (proxy.value === props.falseValue) {
          proxy.value = props.trueValue
          checked.value = true
        } else {
          proxy.value = props.falseValue
          checked.value = false
        }
        emit('update:modelValue', proxy.value)
      }
    }

    const renderInput = () => {
      return <input type='checkbox' name={uid} value={proxy.value} hidden />
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
        return <label for={uid} class={`${name}__label`}>
          {slots.default ? slots.default() : props.label}
        </label>
      }
    }

    return () => <div role='checkbox' aria-checked={proxy.value} class={classes.value} onClick={clickHandler}>
      {renderInput()}
      {renderContent()}
      {renderLabel()}
    </div>
  }
})
