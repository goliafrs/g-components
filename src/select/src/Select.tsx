import { HTMLAttributes, PropType, VNode, computed, defineComponent, h, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'
import { GCard, GChip, GDropdown, GIcon, GList, GListItem, GProgress } from '../..'
import { filterJoinString } from '../../text-field/utils'

import { Color, Icon, Primitive, Size, Style, colors, icons, isChildOf, isPrimitive, sizes, styles } from '../../utils'

import { FormattedSelectItem, SelectItem, SelectTitle, SelectValue } from '../interface'

export const name = 'g-select'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: [ String, Number, Boolean, Array ] as PropType<Primitive | Primitive[]>,
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

  emits: [ 'update:modelValue', 'focus', 'blur', 'click', 'mouseup', 'mousedown' ],

  setup(props, { slots, emit }) {
    const rootRef = ref<HTMLElement>()

    const search = ref<string>('')
    const cursor = ref<number>(0)
    const active = ref<boolean>(false)
    const focused = ref<boolean>(false)

    const selected = ref<FormattedSelectItem[]>([])

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

    const filled = computed<boolean>(() => selectedItems.value.length > 0)
    const disabled = computed<boolean>(() => props.disabled || props.readonly)
    const labelShown = computed<boolean>(() => {
      if (!props.label) {
        return false
      }

      switch (props.style) {
        case 'box':
        case 'solo':
        case 'outline': {
          return !search.value || !selectedItems.value.length
        }
        default: {
          return true
        }
      }
    })

    const items = computed<FormattedSelectItem[]>(() => {
      return props.items.reduce<FormattedSelectItem[]>((accumulator, currentValue, index) => {
        const item = formatItem(currentValue, index)
        if (item && item.searchValid) {
          accumulator.push(item)
        }

        return accumulator
      }, [])
    })
    const disabledItems = computed<FormattedSelectItem[]>(() => props.disabledItems.map(formatItem))
    const selectedItems = computed<FormattedSelectItem[]>(() => {
      let value = unref(props.modelValue)
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean': {
          value = [ value ]
          break
        }
      }

      if (!value) {
        value = []
      }

      return value.reduce<FormattedSelectItem[]>((accumulator, currentValue, index) => {
        const item = formatItem(currentValue, index)
        if (item) {
          accumulator.push(item)
        }

        return accumulator
      }, [])
    })

    const label = computed<undefined | string>(() => {
      if (props.label) {
        return filterJoinString([ props.label.toLocaleString(), props.required && '*' ])
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

    watch(
      () => selected.value,
      () => {
        const value = unref(selected.value)
        console.log(value)
        let result
        if (Array.isArray(value)) {
          result = value.map(getFormatItemValue)
        } else {
          result = getFormatItemValue(value)
        }

        emit('update:modelValue', result)
      },
      { deep: true }
    )

    onMounted(() => {
      document.addEventListener('click', outsideClickHandler)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('click', outsideClickHandler)
    })

    // TODO: ????????????????
    const mainClickHandler = (event: MouseEvent | FocusEvent): void => {
      active.value = !active.value
      focused.value = !focused.value
    }
    const outsideClickHandler = (event: MouseEvent | FocusEvent): void => {
      if (!isChildOf(event.target, rootRef.value)) {
        focused.value = false
      }
    }

    const getSelectItemValueByKey = (item: SelectItem, key: string): Primitive => {
      let value: Primitive

      switch (typeof item) {
        case 'string':
        case 'number':
        case 'boolean': {
          value = item
          break
        }
        case 'object': {
          value = item[key] || item.value
          break
        }
      }

      return value
    }

    const getFormatItemValue = (item: FormattedSelectItem | Primitive | undefined): Primitive | undefined => {
      if (item) {
        switch (typeof item) {
          case 'string':
          case 'number':
          case 'boolean': {
            return item
          }
          case 'object': {
            return item.value
          }
        }
      }
    }

    const compareValues = (
      a: FormattedSelectItem | Primitive | undefined,
      b: FormattedSelectItem | Primitive | undefined
    ): boolean => {
      return getFormatItemValue(a) === getFormatItemValue(b)
    }

    const formatItem = (item: SelectItem, index: number): FormattedSelectItem => {
      const value = getSelectItemValueByKey(item, props.itemValue)
      const label = getSelectItemValueByKey(item, props.itemTitle).toLocaleString()

      return {
        label,
        value,
        hovered: cursor.value === index,
        selected: !!~selectedItems.value.findIndex(selected => compareValues(selected, value)),
        disabled: !!~disabledItems.value.findIndex(disabledItem => compareValues(disabledItem, value)),
        searchValid: checkSearch(label)
      }
    }
    const clearSearch = () => {
      if (search.value) {
        search.value = ''
      }

      focused.value = false
    }
    const checkSearch = (value: Primitive): boolean => {
      if (!search.value) {
        return true
      }

      return !!~('' + value).toLocaleLowerCase().indexOf(search.value)
    }

    const add = (item: FormattedSelectItem): boolean => {
      if (item) {
        const index = selectedItems.value.findIndex(selectedItem => compareValues(selectedItem, item))

        if (index === -1) {
          if (props.multiple) {
            selected.value.push(item)
          } else {
            selected.value.splice(0, 1, item)

            clearSearch()
          }

          return true
        }
      }

      return false
    }
    const remove = (item: FormattedSelectItem): boolean => {
      if (item) {
        const index = selectedItems.value.findIndex(selectedValue => compareValues(getFormatItemValue(selectedValue), item))

        if (index > -1) {
          if (selectedItems.value.length === 1 && props.required) {
            return false
          }

          selected.value.splice(index, 1)

          clearSearch()

          return true
        }
      }

      return false
    }
    const toggle = (item: FormattedSelectItem): boolean => add(item) || remove(item)

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
          add,
          remove,
          toggle
        })
      }

      return <GChip
        label={item.label}
        cancelable={props.multiple}
        callback={() => remove(item)}
        color='grey'
        size='tiny'
      />
    }
    const renderSelection = () => {
      return <div class={`${name}__selection`}>
        {selectedItems.value.map((item, index) => renderSelectionItem(item, index))}
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
        return <div class={`${name}__icon`} onClick={() => selected.value.splice(0, -1)}>
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
      return <div class={`${name}__icon`} onClick={mainClickHandler}>
        {renderArrowOrLoading()}
      </div>
    }
    const renderHolder = () => {
      return <div class={`${name}__holder`}>
        {renderIcon()}

        <div class={`${name}__group`} onClick={!props.multiple ? mainClickHandler : undefined}>
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
          add,
          remove,
          toggle
        })
      }

      return <GListItem
        label={item.label}
        disabled={item.disabled}
        active={item.selected}
        onClick={() => add(item)}
      />
    }
    const renderItems = () => {
      return <GList>{items.value.map(renderItem)}</GList>
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

    return () => <div class={classes.value} ref={rootRef}>
      {renderTabindex()}
      {renderLabel()}
      {renderHolder()}
      {renderDropdown()}
      {renderFooter()}
    </div>
  }
})
