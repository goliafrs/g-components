import { JSXElement } from '@babel/types'
import { HTMLAttributes, PropType, Slot, VNode, computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { GCard, GChip, GDropdown, GIcon, GList, GListItem, GProgress } from '../..'

import { colors, isChildOf, sizes, styles } from '../../utils'
import { icons } from '../../utils/icons'
import { Color, Icon, Size, Style } from '../../utils/interface'
import { SelectDisplayItem, SelectItem, SelectTitle, SelectValue } from '../interface'

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
    itemsDisabled: {
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
    const selectedItems = ref<SelectItem[]>([])
    const selectedValues = ref<SelectItem[]>([])
    const cursorPosition = ref<number>(0)
    const focused = ref<boolean>(false)

    const proxy = computed<boolean>({
      get: () => props.modelValue,
      set: (value: boolean) => emit('update:modelValue', value)
    })

    const filled = computed<boolean>(() => selectedItems.value.length > 0)
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
          return !!search.value || !!selectedItems.value.length
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
    const items = computed<SelectDisplayItem[]>(() => {
      return props.items.map(clearDisplayItem)
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
      return
    }
    const outsideClickHandler = (event: MouseEvent | FocusEvent): void => {
      if (!isChildOf(event.target, rootRef.value)) {
        focused.value = false
      }
    }

    const compareValues = (a: SelectItem, b: SelectItem): boolean => a === b

    const getItemValue = (item: SelectItem): SelectItem => typeof item === 'object' ? item[itemValue.value] : item
    const getItemTitle = (item: SelectItem): SelectItem => typeof item === 'object' ? item[itemTitle.value] : getItemValue(item)

    const clearSelectedItem = (item: SelectItem): any => {
      return {
        [itemTitle.value]: getItemValue(item),
        [itemValue.value]: getItemTitle(item)
      }
    }
    const clearDisplayItem = (item: SelectItem, index: number): any => {
      const value = getItemValue(item)
      const title = getItemTitle(item)

      return {
        label: title,
        hovered: cursorPosition.value === index,
        selected: !!~selectedValues.value.findIndex((selectedValue: SelectItem) => compareValues(selectedValue, value)),
        disabled: !!~props.itemsDisabled.findIndex((itemDisabled: SelectItem) => compareValues(typeof itemDisabled === 'object' ? itemDisabled[itemValue.value] : itemDisabled, value)),
        searchValid: !search.value || !!~('' + title).toLocaleLowerCase().indexOf(search.value)
      }
    }
    const clearSearch = () => {
      if (search.value) {
        search.value = ''
      }
    }
    const addByValue = (item: SelectItem): boolean => {
      const value = getItemValue(item)
      const index = selectedValues.value.findIndex(selectedValue => compareValues(getItemValue(selectedValue), value))

      if (index === -1) {
        if (props.multiple) {
          selectedValues.value.push(value)
        } else {
          selectedValues.value.splice(0, 1, value)

          clearSearch()

          focused.value = false
        }

        return true
      }

      return false
    }
    const removeByValue = (item: SelectItem): boolean => {
      const value = getItemValue(item)
      const index = selectedValues.value.findIndex(selectedValue => compareValues(getItemValue(selectedValue), value))

      if (index > -1) {
        if (selectedValues.value.length === 1 && props.required) {
          return false
        }

        selectedValues.value.splice(index, 1)

        clearSearch()

        return true
      }

      return false
    }
    // TODO: проверить работоспособность
    const removeByIndex = (index: number, amount: number) => {
      index = index || selectedValues.value.length - 1
      amount = amount || selectedValues.value.length

      for (let i = 0; i < amount; i++) {
        if (!removeByValue(selectedValues.value[index])) {
          return false
        }
      }

      clearSearch()

      return true
    }
    const toggleByValue = (item: SelectItem): boolean => {
      return addByValue(item) || removeByValue(item)
    }

    const renderTabindex = () => {
      return <input tabindex={props.tabindex} hidden onFocus={mainClickHandler} onBlur={outsideClickHandler} />
    }
    const renderLabel = () => {
      if (labelShown.value) {
        return <div class={`${name}__label`}>{label.value}</div>
      }
    }
    const renderSelectionItem = (item: SelectItem, index: number) => {
      if (slots.selection) {
        return slots.selection({
          item,
          index,
          items: selectedItems.value,
          addByValue,
          removeByValue,
          removeByIndex,
          toggleByValue
        })
      }

      return <GChip
        label={getItemTitle(item).toLocaleString()}
        cancelable={props.multiple}
        callback={() => removeByValue(item)}
        size={props.size}
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
          <GIcon value={props.icon} color={props.color} size={size.value} />
        </div>
      }
    }
    const renderClearable = () => {
      if (props.clearable) {
        return <div class={`${name}__icon`} onClick={() => removeByIndex(0, 0)}>
          <GIcon value='clear' color='grey' size={size.value} />
        </div>
      }
    }
    const renderArrowOrLoading = () => {
      if (props.loading) {
        return <GProgress indeterminate color={props.color} width={1} size={size.value - 4} />
      } else {
        return <GIcon value={focused.value ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} color='grey' size={size.value} />
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
    const renderItem = (item: SelectDisplayItem, index: number) => {
      if (slots.item) {
        return slots.item({
          item,
          index,
          items: selectedItems.value,
          addByValue,
          removeByValue,
          removeByIndex,
          toggleByValue
        })
      }

      return <GListItem label={item.label} disabled={item.disabled} active={item.selected} />
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
      return <div class={`${name}__border`}></div>
    }
    const renderDetails = () => {
      if (props.details) {
        return <div class={`${name}__details`}>
          {props.error || props.hint}
        </div>
      }
    }
    const renderFooter = () => {
      if (!props.style) {
        return <div class={`${name}__footer`}>
          {renderBorder()}
          {renderDetails()}
        </div>
      }
    }

    return () => <div
      class={{
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
      }}

      ref={rootRef}
    >
      {renderTabindex()}
      {renderLabel()}
      {renderHolder()}
      {renderDropdown()}
      {renderFooter()}
    </div>
  }
})
