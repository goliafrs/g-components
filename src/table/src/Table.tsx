import { PropType, computed, defineComponent, h } from 'vue'
import { GEmpty } from '../..'

import { sizes } from '../../utils'
import { Size } from '../../utils/interface'
import { TableHeader } from '../interface'

export const name = 'g-table'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: Object as PropType<Record<string, string | number>>,
      default: () => ({})
    },

    headers: {
      type: Array as PropType<TableHeader[]>,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },

    sortLocal: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },

    sortType: {
      type: String,
      default: 'string',
      validator: (value: string): boolean => {
        return !!~[ 'string', 'number' ].indexOf(value)
      }
    },
    size: {
      type: String as PropType<Size>,
      default: undefined,
      validator: (value: Size): boolean => {
        return !!~sizes.indexOf(value)
      }
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { slots, emit }) {
    const proxy = computed<Record<string, string | number>>({
      get: () => props.modelValue,
      set: (value: Record<string, string | number>) => emit('update:modelValue', value)
    })

    const sorting = (value: string) => {
      switch (proxy.value[value]) {
        case 1:
        case '1':
        case 'asc':
        case 'ASC': {
          proxy.value[value] = props.sortType === 'string' ? 'DESC' : -1
          break
        }
        case -1:
        case '-1':
        case 'desc':
        case 'DESC': {
          delete proxy.value[value]
          break
        }
        default: {
          proxy.value[value] = props.sortType === 'string' ? 'ASC' : 1
          break
        }
      }
    }

    const renderHeaderCell = (header: TableHeader, index: number) => {
      const { value, title, sortable, align } = header

      if (value) {
        return <th
          class={{
            [`${name}__header-cell`]: true,

            [`${name}__header-cell--${align}`]: !!align,

            [`${name}__header-cell--sortable`]: sortable,
            [`${name}__header-cell--sortable-desc`]: sortable && !!proxy.value[value] && !!~[ 'desc', 'DESC', '-1', -1 ].indexOf(proxy.value[value]),
            [`${name}__header-cell--sortable-active`]: sortable && !!proxy.value[value]
          }}

          onClick={() => sortable ? sorting(value) : undefined}
        >
          <div class={`${name}__header-cell-title`}>{title || value}</div>
        </th>
      }
    }
    const renderHeader = () => {
      if (props.headers.length) {
        return <thead class={`${name}__header`}>
          <tr class={`${name}__header-row`}>
            {
              props.headers.map((header, index) => {
                return slots.header ? slots.header(header, index) : renderHeaderCell(header, index)
              })
            }
          </tr>
        </thead>
      }
    }
    const renderBody = () => {
      if (props.items.length) {
        return <tbody class={`${name}__body`}>
          {props.items.map((item, index) => slots.item ? slots.item(item, index) : undefined)}
        </tbody>
      } else {
        return slots.empty ? slots.empty() : <GEmpty />
      }
    }
    const renderFooter = () => {
      if (slots.footer) {
        return <tfoot class={`${name}__footer`}>
          <tr class={`${name}_footer-row`}>{slots.footer()}</tr>
        </tfoot>
      }
    }

    return () => <table
      class={{
        [name]: true,
        [`${name}--${props.size}`]: !!props.size
      }}
    >
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </table>
  }
})
