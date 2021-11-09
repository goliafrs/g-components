import { HTMLAttributes, PropType, VNode, computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { GCard, GChip, GDropdown, GIcon, GList, GListItem, GProgress } from '../..'

import { Color, Icon, Primitive, Size, Style, colors, icons, isChildOf, isPrimitive, sizes, styles } from '../../utils'

import { FormattedSelectItem, SelectItem, SelectTitle, SelectValue } from '../interface'

export const name = 'g-select'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: null,
      default: undefined
    },

    items: {
      type: Array as PropType<SelectItem[]>,
      default: () => []
    },
    disabledItems: {
      type: Array as PropType<SelectItem[]>,
      default: () => []
    },

    itemTitle: {
      type: String as PropType<SelectTitle>,
      default: 'title'
    },
    itemValue: {
      type: String as PropType<SelectValue>,
      default: 'value'
    },

    label: {
      type: String,
      default: undefined
    },
    hint: {
      type: String,
      default: undefined
    },
    error: {
      type: String,
      default: undefined
    },

    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    details: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },

    tabindex: {
      type: Number as PropType<HTMLAttributes['tabindex']>,
      default: undefined
    },

    color: {
      type: String as PropType<Color>,
      default: undefined,
      validator: (value: Color): boolean => {
        return !!~colors.indexOf(value)
      }
    },
    style: {
      type: String as PropType<Style>,
      default: undefined,
      validator: (value: Style): boolean => {
        return !!~styles.indexOf(value)
      }
    },
    size: {
      type: String as PropType<Size>,
      default: undefined,
      validator: (value: Size): boolean => {
        return !!~sizes.indexOf(value)
      }
    },
    icon: {
      type: String as PropType<Icon>,
      default: undefined,
      validator: (value: Icon): boolean => {
        return !!~icons.indexOf(value)
      }
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { slots, emit }) {
    const rootRef = ref<HTMLElement>()

    const search = ref<string>('')
    const cursor = ref<number>(0)
    const focused = ref<boolean>(false)

    const proxy = computed<Primitive | Primitive[]>({
      get: () => props.modelValue,
      set: (value: SelectItem | SelectItem[]): void => {
        let result
        if (Array.isArray(value)) {
          result = value.map(item => getItemValue(item))
        } else {
          result = getItemValue(value)
        }

        emit('update:modelValue', result)
      }
    })

    const classes = computed(() => {
      return {
        [`${name}`]: true,

        [`${name}--filled`]: filled.value,
        [`${name}--active`]: active.value,
        [`${name}--labeled`]: !!props.label,
        [`${name}--disabled`]: props.disabled,
        [`${name}--readonly`]: props.readonly,
        [`${name}--clearable`]: props.clearable,
        [`${name}--flat`]: props.flat,
        [`${name}--dense`]: props.dense,
        [`${name}--rounded`]: props.rounded,
        [`${name}--error`]: !!props.error,
        [`${name}--multiple`]: props.multiple,

        [`${name}--${props.color}`]: !!props.color,
        [`${name}--${props.style}`]: !!props.style,
        [`${name}--${props.size}`]: !!props.size
      }
    })

    const filled = computed<boolean>(() => selection.value.length > 0)
    const active = computed<boolean>(() => false) // TODO: переписать под реальные условия
    const disabled = computed<boolean>(() => props.disabled || props.readonly)
    const label = computed<string>(() => [ props.label, props.required && '*' ].filter(item => !!item).join(' '))
    const labelShown = computed<boolean>(() => {
      if (!props.label) {
        return false
      }

      switch (props.style) {
        case 'box':
        case 'solo':
        case 'outline': {
          return !search.value || !selection.value.length
        }
        default: {
          return true
        }
      }
    })
    const itemTitle = computed<SelectTitle>({
      get: () => props.itemTitle,
      set: (value): SelectTitle => itemTitle.value = value
    })
    const itemValue = computed<SelectValue>({
      get: () => props.itemValue,
      set: (value): SelectValue => itemValue.value = value
    })
    const items = computed<FormattedSelectItem[]>(() => props.items.map(formatItem))
    // TODO: переосмыслить и дописать
    const selection = computed<FormattedSelectItem[]>({
      get: () => {
        let value = proxy.value
        if (isPrimitive(value)) {
          value = [ value ]
        }

        return value.reduce<FormattedSelectItem[]>((accumulator, currentValue, index) => {
          const item = formatItem(currentValue, index)
          if (item) {
            accumulator.push(item)
          }

          return accumulator
        }, [])
      },
      set: (value): FormattedSelectItem[] => selection.value = value
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

    onMounted(() => {
      document.addEventListener('click', outsideClickHandler)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('click', outsideClickHandler)
    })

    const mainClickHandler = (event: MouseEvent | FocusEvent): void => {
      return // TODO: дописать
    }
    const outsideClickHandler = (event: MouseEvent | FocusEvent): void => {
      if (!isChildOf(event.target, rootRef.value)) {
        focused.value = false
      }
    }

    const compareValues = (
      a: SelectItem | FormattedSelectItem | undefined,
      b: SelectItem | FormattedSelectItem | undefined
    ): boolean => {
      return getItemValue(a) === getItemValue(b)
    }

    const getItemValue = (item: SelectItem | FormattedSelectItem | Primitive | undefined): Primitive | undefined => {
      if (item) {
        return isPrimitive(item) ? item : item[itemValue.value]
      }
    }
    const getItemTitle = (item: SelectItem | FormattedSelectItem | undefined): string | undefined => {
      if (item) {
        const title = isPrimitive(item) ? getItemValue(item) : item[itemTitle.value]
        if (title) {
          return title.toLocalString()
        }
      }
    }

    const formatItem = (item: SelectItem, index: number): FormattedSelectItem => {
      const label = getItemTitle(item)
      const value = getItemValue(item)

      return {
        label,
        value,
        hovered: cursor.value === index,
        selected: !!~selection.value.findIndex(selected => compareValues(selected, value)),
        disabled: !!~props.disabledItems.findIndex(disabledItem => compareValues(disabledItem, value)),
        searchValid: !search.value || !!~('' + label).toLocaleLowerCase().indexOf(search.value)
      }
    }
    const clearSearch = () => {
      if (search.value) {
        search.value = ''
      }

      focused.value = false
    }
    const addByValue = (value: Primitive | undefined): boolean => {
      if (value) {
        const index = selection.value.findIndex(selectedValue => compareValues(selectedValue, value))
        const result = formatItem(value, selection.value.length)

        if (index === -1) {
          if (props.multiple) {
            selection.value.push(result)
          } else {
            selection.value.splice(0, 1, result)

            clearSearch()
          }

          return true
        }
      }

      return false
    }
    const removeByValue = (value: Primitive | undefined): boolean => {
      if (value) {
        const index = selection.value.findIndex(selectedValue => compareValues(getItemValue(selectedValue), value))

        if (index > -1) {
          if (selection.value.length === 1 && props.required) {
            return false
          }

          selection.value.splice(index, 1)

          clearSearch()

          return true
        }
      }

      return false
    }
    const toggleByValue = (value: Primitive): boolean => addByValue(value) || removeByValue(value)

    const renderTabindex = () => {
      return <input tabindex={props.tabindex} hidden onFocus={mainClickHandler} onBlur={outsideClickHandler} />
    }
    const renderLabel = () => {
      if (labelShown.value) {
        return <div class={`${name}__label`}>{label.value}</div>
      }
    }
    const renderSelectionItem = (item: FormattedSelectItem, index: number) => {
      if (slots.selection) {
        return slots.selection({
          item,
          index,
          selection: selection.value,
          addByValue,
          removeByValue,
          toggleByValue
        })
      }

      return <GChip
        label={item.label}
        cancelable={props.multiple}
        callback={() => removeByValue(getItemValue(item))}
        size={props.size}
      />
    }
    const renderSelection = () => {
      return <div class={`${name}__selection`}>
        {selection.value.map((item, index) => renderSelectionItem(item, index))}
      </div>
    }
    const renderIcon = () => {
      if (props.icon) {
        return <div class={`${name}__icon`}>
          <GIcon icon={props.icon} color={props.color} size={size.value} />
        </div>
      }
    }
    const renderClearable = () => {
      if (props.clearable) {
        return <div class={`${name}__icon`} onClick={() => selection.value.splice(0, -1)}>
          <GIcon icon='clear' color='grey' size={size.value} />
        </div>
      }
    }
    const renderArrowOrLoading = () => {
      if (props.loading) {
        return <GProgress indeterminate color={props.color} width={1} size={size.value - 4} />
      } else {
        return <GIcon icon={focused.value ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} color='grey' size={size.value} />
      }
    }
    const renderArrow = () => {
      return <div class={`${name}__icon`}>
        {renderArrowOrLoading()}
      </div>
    }
    const renderHolder = () => {
      return <div class={`${name}__holder`} onClick={() => focused.value = !focused.value}>
        {renderIcon()}

        <div class={`${name}__group`}>
          {renderSelection()}
        </div>

        {renderClearable()}
        {renderArrow()}
      </div>
    }
    const renderItem = (item: FormattedSelectItem, index: number) => {
      if (slots.item) {
        return slots.item({
          item,
          index,
          selection: selection.value,
          addByValue,
          removeByValue,
          toggleByValue
        })
      }

      return <GListItem
        label={item.label}
        disabled={item.disabled}
        active={item.selected}
        onClick={() => addByValue(getItemValue(item))}
      />
    }
    const renderItems = () => {
      return <GList>
        {items.value.reduce<VNode[]>((result, item, index) => {
          if (item.searchValid) {
            result.push(renderItem(item, index) as VNode)
          }

          return result
        }, [])}
      </GList>
    }
    const renderAttach = () => {
      return <div class={`${name}__attach`}></div>
    }
    const renderDropdown = () => {
      return <GDropdown
        v-model={focused.value}
        v-slots={{ activator: () => renderAttach() }}
        shadow
        offsetDistance={0}
        closeOnClick={false}
        closeOnContentClick={!props.multiple}
      >
        <GCard width='100%'>{renderItems()}</GCard>
      </GDropdown>
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

    return () => <div class={classes} ref={rootRef}>
      {renderTabindex()}
      {renderLabel()}
      {renderHolder()}
      {renderDropdown()}
      {renderFooter()}
    </div>
  }
})
