import { computed, defineComponent, getCurrentInstance, h, ref } from 'vue'

import { GIcon, GInput, GProgress } from '../..'
import { props } from '../../text-field/src/TextField'
import { filterJoinString } from '../../text-field/utils'

export const name = 'g-textarea'

export default defineComponent({
  name,

  extends: GInput,

  props: {
    ...props,

    grow: {
      type: Boolean,
      default: false
    }
  },

  emits: [ 'update:modelValue', 'focus', 'blur', 'click', 'mouseup', 'mousedown' ],

  setup(props, { emit }) {
    const uid = getCurrentInstance()?.uid
    const key = `${name}-${uid}`

    const inputRef = ref<HTMLElement>()

    const active = ref<boolean>(false)
    const focused = ref<boolean>(false)

    const proxy = computed<void | string | number>({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value)
    })

    const classes = computed(() => {
      return {
        [name]: true,

        [`${name}--flat`]: props.flat,
        [`${name}--rounded`]: props.rounded,

        [`${name}--error`]: !!props.error,

        [`${name}--active`]: isActive.value,
        [`${name}--filled`]: filled.value,
        [`${name}--focused`]: isFocused.value,
        [`${name}--labeled`]: labeled.value,

        [`${name}--required`]: props.required,
        [`${name}--disabled`]: props.disabled,
        [`${name}--readonly`]: props.readonly,

        [`${name}--clearable`]: clearable.value,

        [`${name}--${props.size}`]: !!props.size,
        [`${name}--${props.color}`]: !!props.color,
        [`${name}--${props.style}`]: !!props.style
      }
    })
    const label = computed<undefined | string>(() => {
      if (props.label) {
        return filterJoinString([ props.label.toLocaleString(), props.required && '*' ])
      }

      return undefined
    })
    const placeholder = computed<undefined | string>(() => {
      if (props.placeholder) {
        const result = filterJoinString([ props.placeholder.toLocaleString(), props.required && '*' ])
        switch (props.style) {
          case 'box':
          case 'solo':
          case 'outline': {
            if (!props.details && props.error) {
              return props.error.toLocaleString()
            } else {
              return result
            }
          }
          default: {
            return result
          }
        }
      }

      return undefined
    })

    const size = computed<number>(() => {
      switch (props.size) {
        case 'tiny': { return 14 }
        case 'small': { return 18 }
        case 'large': { return 26 }
        case 'giant': { return 30 }
        case 'medium':
        default: { return 22 }
      }
    })

    const isActive = computed<boolean>(() => active.value)
    const isFocused = computed<boolean>(() => focused.value)
    const filled = computed<boolean>(() => typeof proxy.value === 'number' ? !!proxy.value.toLocaleString() : !!proxy.value)
    const labeled = computed<boolean>(() => {
      if (!props.label) {
        return false
      }

      switch (props.style) {
        case 'box':
        case 'solo':
        case 'outline': {
          return !filled.value
        }
        default: {
          return true
        }
      }
    })
    const disabled = computed<boolean>(() => !!(props.disabled || props.readonly))
    const clearable = computed<boolean>(() => props.clearable && !disabled.value && !!proxy.value)

    const onFocusIn = (event: FocusEvent) => {
      if (!disabled.value) {
        focused.value = true
        emit('focus', event)
      }
    }
    const onFocusOut = (event: FocusEvent) => {
      if (!disabled.value) {
        focused.value = false
        emit('blur', event)
      }
    }
    const onClick = (event: MouseEvent) => {
      if (!disabled.value) {
        inputRef.value?.focus()
        emit('click', event)
      }
    }
    const onMouseUp = (event: MouseEvent) => {
      if (!disabled.value) {
        active.value = false
        emit('mouseup', event)
      }
    }
    const onMouseDown = (event: MouseEvent) => {
      if (!disabled.value) {
        active.value = true
        emit('mousedown', event)
      }
    }

    const clear = () => proxy.value = props.defaultValue

    const renderLabel = () => {
      if (labeled.value) {
        return <label class={`${name}__label`} for={key}>{label.value}</label>
      }
    }
    const renderInput = () => {
      return <GInput
        tag='textarea'

        v-model={proxy.value}

        class={`${name}__input`}

        id={key}
        name={key}

        cols={props.cols}
        rows={props.rows}
        grow={props.grow}

        placeholder={placeholder.value}

        required={props.required}
        disabled={props.disabled}
        readonly={props.readonly}

        onFocusin={onFocusIn}
        onFocusout={onFocusOut}
        onClick={onClick}
        onMouseup={onMouseUp}
        onMousedown={onMouseDown}

        ref={inputRef}
      />
    }
    const renderClearable = () => {
      if (clearable.value) {
        return <div class={`${name}__icon`} onClick={clear}>
          <GIcon icon='clear' color='grey' size={size.value} />
        </div>
      }
    }
    const renderLoading = () => {
      if (props.loading) {
        return <GProgress indeterminate color={props.color} width={1} size={size.value - 4} />
      }
    }
    const renderGroup = () => {
      return <div class={`${name}__group`} onClick={() => inputRef.value?.focus()}>
        {renderInput()}
      </div>
    }
    const renderHolder = () => {
      return <div class={`${name}__holder`}>
        {renderGroup()}
        {renderLoading() || renderClearable()}
      </div>
    }
    const renderBorder = () => {
      if (!props.style) {
        return <div class={`${name}__border`}></div>
      }
    }
    const renderDetails = () => {
      if (props.details) {
        return <div class={`${name}__details`}>
          {props.error || props.hint}
        </div>
      }
    }
    const renderFooter = () => {
      return <div class={`${name}__footer`}>
        {renderBorder()}
        {renderDetails()}
      </div>
    }

    return () => <div class={classes.value} key={key}>
      {renderLabel()}
      {renderHolder()}
      {renderFooter()}
    </div>
  }
})
