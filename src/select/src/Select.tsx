import { HTMLAttributes, PropType, computed, defineComponent, h, reactive, ref } from 'vue'

import { colors, styles } from '../../utils'
import { Color, Style } from '../../utils/interface'
import { SelectItem, SelectTitle, SelectValue } from '../interface'

export const name = 'g-select'

export default defineComponent({
  name,

  props: {
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
    }
  },

  setup(props) {
    const search = ref<string>('')
    const selectedItems = ref<SelectItem[]>([])
    const selectedValues = ref<SelectItem[]>([])
    const cursorPosition = ref<number>(0)
    const focused = ref<boolean>(false)

    const filled = computed<boolean>(() => selectedItems.value.length > 0)
    const itemTitle = computed<SelectTitle>({
      get: () => props.itemTitle,
      set: (value): SelectTitle => itemTitle.value = value
    })
    const itemValue = computed<SelectValue>({
      get: () => props.itemValue,
      set: (value): SelectValue => itemValue.value = value
    })
    const displayItems = computed<SelectValue[]>(() => {
      return props.items.map(clearDisplayItem)
    })

    const mainClickHandler = (event: MouseEvent | FocusEvent): void => {
      return
    }
    const outsideClickHandler = (event: MouseEvent | FocusEvent): void => {
      return
    }
    const compareValues = (a: SelectItem, b: SelectItem): boolean => a === b
    const clearSelectedItem = (item: SelectItem): SelectItem => {
      const value = typeof item === 'object' ? item[itemValue.value] : item
      const title = typeof item === 'object' ? item[itemTitle.value] : value

      return {
        [itemTitle.value]: title,
        [itemValue.value]: value
      }
    }
    const clearDisplayItem = (item: SelectItem, index: number): any => {
      const value = typeof item === 'object' ? item[itemValue.value] : item
      const title = typeof item === 'object' ? item[itemTitle.value] : value

      return {
        [itemTitle.value]: title,
        [itemValue.value]: value,

        hovered: cursorPosition.value === index,
        selected: !!~selectedValues.value.findIndex((selectedValue: SelectItem) => compareValues(selectedValue, value)),
        disabled: !!~props.itemsDisabled.findIndex((itemDisabled: SelectItem) => compareValues(typeof itemDisabled === 'object' ? itemDisabled[itemValue.value] : itemDisabled, value)),
        searchValid: !search.value || !!~('' + title).toLocaleLowerCase().indexOf(search.value)
      }
    }
    const addByValue = (value: SelectItem): boolean => {
      value = typeof value === 'object' ? value[itemValue.value] : value

      const index = selectedValues.value.findIndex(selectedValue => {
        const compareValue = typeof selectedValue === 'object' ? selectedValue[itemValue.value] : selectedValue

        return compareValues(compareValue, value)
      })

      if (index === -1) {
        if (props.multiple) {
          selectedValues.value.push(value)
        } else {
          selectedValues.value.splice(0, 1, value)

          if (search.value) {
            search.value = ''
          }

          focused.value = false
        }

        return true
      }

      return false
    }

    const renderTabindex = () => {
      return <input tabindex={props.tabindex} hidden onFocus={mainClickHandler} onBlur={outsideClickHandler} />
    }

    return () => <div
      class={{
        [`${name}`]: true,

        [`${name}--${props.color}`]: !!props.color,
        [`${name}--${props.style}`]: !!props.style,

        [`${name}--filled`]: filled.value,
        [`${name}--active`]: isActive,
        [`${name}--labeled`]: !!props.label,
        [`${name}--disabled`]: props.disabled,
        [`${name}--readonly`]: props.readonly,
        [`${name}--flat`]: props.flat,
        [`${name}--dense`]: props.dense,
        [`${name}--rounded`]: props.rounded,
        [`${name}--error`]: !!props.error,
        [`${name}--multiple`]: props.multiple
      }}
    >
      {renderTabindex()}
    </div>
  }
})
