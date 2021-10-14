import { chunk } from 'lodash'

import { PropType, computed, defineComponent, getCurrentInstance, h, onMounted, reactive, ref, watch } from 'vue'
import { GButton, GList, GListItem } from 'g-components'

export const name = 'g-date-picker'

export interface DateToday {
  year: number,
  month: number,
  day: number
}

export interface Month {
  full: string,
  short: string,
  number: number
}

const today = new Date()
today.setHours(0, 0, 0, 0)

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: Array as PropType<(string | number)[]>,
      default: () => []
    },

    localeTag: {
      type: String,
      default: 'en'
    },
    yearsFill: {
      type: Number,
      default: 50
    },

    min: {
      type: [ Number, String, Date ],
      default: undefined
    },
    max: {
      type: [ Number, String, Date ],
      default: undefined
    },

    range: {
      type: Boolean,
      default: false
    },

    filter: {
      type: Function,
      default: (value: any) => value
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const uid = getCurrentInstance()?.uid

    const rootRef = ref<HTMLElement>()
    const yearsRef = ref<HTMLElement>()

    const date = ref<DateToday>({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate()
    })

    const state = ref<'days' | 'months' | 'years'>('days')
    const proxy = ref(props.modelValue)
    const hoverDay = ref(0)

    const days = computed(() => {
      const result = []

      const dayOfFirstDate = new Date(date.value.year, date.value.month, 1).getDay()
      const dayAmount = new Date(date.value.year, date.value.month + 1, 0).getDate()

      const diff = dayOfFirstDate - 1
      const prepend = diff < 0 ? 7 + diff : diff

      for (let index = 0; index < prepend; index++) {
        result.push(undefined)
      }

      for (let index = 1; index <= dayAmount; index++) {
        result.push(index)
      }

      return chunk(result, 7)
    })
    const daysOfWeek = computed((): string[] => {
      const result = []

      const currentDate = new Date()
      const day = currentDate.getDay()
      const firstDay = new Date(currentDate.setDate(currentDate.getDate() - day + (day === 0 ? -6 : 1)))

      for (let i = 0; i < 7; i++) {
        result.push(firstDay.toLocaleString(props.localeTag, { weekday: 'narrow' }))
        firstDay.setDate(firstDay.getDate() + 1)
      }

      return result
    })
    const months = computed((): Month[] => {
      const result = []

      for (let index = 0; index < 12; index++) {
        result.push({
          full: new Date(0, index).toLocaleString(props.localeTag, { month: 'long' }),
          short: new Date(0, index).toLocaleString(props.localeTag, { month: 'short' }).substring(0, 3),
          number: index
        })
      }

      return result
    })
    const years = computed((): number[] => {
      const result = []

      for (let year = date.value.year + props.yearsFill; year >= date.value.year - props.yearsFill; year--) {
        result.push(year)
      }

      return result.reverse()
    })

    const min = computed((): number | void => {
      if (props.min) {
        return new Date(props.min).getTime()
      }

      return undefined
    })
    const max = computed((): number | void => {
      if (props.max) {
        return new Date(props.max).getTime()
      }

      return undefined
    })

    // FIXME: не работает, подправить под новые классы
    const scrollYearsList = (): void => {
      if (state.value === 'years') {
        setTimeout(() => {
          if (rootRef.value && yearsRef.value) {
            const activeYearElement: HTMLElement = yearsRef.value.querySelector(`.${name}__years--active`) as HTMLElement
            if (activeYearElement) {
              yearsRef.value.scrollTop = activeYearElement.offsetTop - rootRef.value.offsetHeight / 2
            }
          }
        }, 100)
      }
    }
    const arrowClickHandler = (direction = -1): void => {
      if (direction < 0) {
        switch (state.value) {
          case 'years':
            date.value.year--
            break
          case 'months':
          case 'days':
          default:
            if (date.value.month <= 0) {
              date.value.year--
              date.value.month = 11
            } else {
              date.value.month--
            }
            date.value.day = 1
            break
        }
      }
      if (direction > 0) {
        switch (state.value) {
          case 'years':
            date.value.year++
            break
          case 'months':
          case 'days':
          default:
            if (date.value.month >= 11) {
              date.value.year++
              date.value.month = 0
            } else {
              date.value.month++
            }
            date.value.day = 1
            break
        }
      }
    }
    const getMSByDay = (day: number): number => {
      return new Date(date.value.year, date.value.month, day).getTime()
    }
    const pickDateHandler = (day: number) => {
      if (day && !isNaN(day)) {
        const pickedDate = getMSByDay(day)

        date.value.day = day

        if (props.range && proxy.value.length < 2 && pickedDate !== proxy.value[0]) {
          proxy.value.push(pickedDate)
          proxy.value.sort()
        } else if (!props.range || proxy.value.length === 2) {
          proxy.value = [ pickedDate ]
        }
      }
    }
    const isActiveDay = (ms: number): boolean | any => {
      const isActiveDate = proxy.value.some((value: string | number) => ms === value)

      const [ leftEdge, rightEdge ] = proxy.value

      let isInRange = false
      let isLeftActiveEdge = false
      let isRightActiveEdge = false
      let isLeftActiveHoverDate = false
      let isRightActiveHoverDate = false

      if (proxy.value.length > 1) {
        isInRange = ms < rightEdge && ms > leftEdge
        isLeftActiveEdge = ms === leftEdge
        isRightActiveEdge = ms === rightEdge
      }

      const hoverDays = [ leftEdge, hoverDay.value ]
      hoverDays.sort()

      if (hoverDays.length === 2 && proxy.value.length === 1) {
        const [ leftHoveringEdge, rightHoveringEdge ] = hoverDays

        isLeftActiveHoverDate = ms === leftHoveringEdge
        isRightActiveHoverDate = ms === rightHoveringEdge
      }

      let isActiveHoverDay = false

      if (hoverDay.value && proxy.value.length === 1) {
        const value = new Date(proxy.value[0]).getTime()
        const lt = ms < Math.max(value, hoverDay.value)
        const gt = ms > Math.min(value, hoverDay.value)

        isActiveHoverDay = lt && gt
      }

      return {
        isInRange,
        isActiveDate,
        isActiveHoverDay,
        isLeftActiveEdge,
        isRightActiveEdge,
        isLeftActiveHoverDate,
        isRightActiveHoverDate
      }
    }
    const isActiveMonth = (year: number, month: number): boolean => {
      if (!proxy.value.length) {
        return false
      }

      const monthForCheck = new Date(year, month)
      const currentDate = new Date(proxy.value[0])

      if (proxy.value.length < 2) {
        return currentDate.getMonth() === monthForCheck.getMonth() && currentDate.getFullYear() === monthForCheck.getFullYear()
      }

      const leftBorder = currentDate
      leftBorder.setDate(1)
      leftBorder.setHours(0, 0, 0, 0)

      const rightBorder = new Date(proxy.value[1])
      rightBorder.setDate(1)
      rightBorder.setHours(0, 0, 0, 0)

      return leftBorder.getTime() <= monthForCheck.getTime() && rightBorder.getTime() >= monthForCheck.getTime()
    }
    const isActiveYear = (year: number): boolean => {
      if (!proxy.value.length) {
        return false
      }

      const [ leftEdge, rightEdge ] = proxy.value
      const leftActiveEdge = new Date(leftEdge).getFullYear()

      if (proxy.value.length < 2) {
        return leftActiveEdge === year
      }

      const rightActiveEdge = new Date(rightEdge).getFullYear()

      return leftActiveEdge <= year && rightActiveEdge >= year
    }

    watch(() => props.modelValue, () => {
      const data = props.modelValue.reduce<number[]>((result, value) => {
        const date = new Date(value)
        if (date instanceof Date) {
          date.setHours(0, 0, 0, 0)
          result.push(date.getTime())
        }

        return result
      }, [])

      if (data.length > 1 && data[0] === data[1]) {
        data.pop()
      }

      proxy.value.splice(0, proxy.value.length, ...data)
    })
    watch(() => proxy.value, () => {
      let value
      if (props.range) {
        value = proxy.value
      } else {
        value = [ proxy.value[0] ]
      }

      if (JSON.stringify(props.modelValue) !== JSON.stringify(value)) {
        emit('update:modelValue', props.filter(value))
      }
    })
    watch(() => state, scrollYearsList)
    watch(() => date, (oldData, newData) => {
      if (oldData.value.year !== newData.value.year) {
        scrollYearsList()
      }

      if (date.value.month < 0) {
        date.value.year--
        date.value.month = 11
        date.value.day = 1
      } else if (date.value.month > 11) {
        date.value.year++
        date.value.month = 0
        date.value.day = 1
      }
    })

    onMounted(() => {
      if (proxy.value[0]) {
        const value = new Date(proxy.value[0])
        if (value instanceof Date) {
          date.value.year = value.getFullYear()
          date.value.month = value.getMonth()
          date.value.day = value.getDate()
        }
      }
    })

    const renderTitle = () => {
      const currentDate = new Date(date.value.year, date.value.month, date.value.day)

      return <div class={`${name}__title`}>
        <span class={`${name}__title-item ${name}__title-item--day`} onClick={() => state.value = 'days'}>
          {currentDate.toLocaleString(props.localeTag, { day: 'numeric' })}
        </span>
        <span class={`${name}__title-item ${name}__title-item--month`} onClick={() => state.value = 'months'}>
          {currentDate.toLocaleString(props.localeTag, { month: 'long' })}
        </span>
        <span class={`${name}__title-item ${name}__title-item--year`} onClick={() => state.value = 'years'}>
          {date.value.year}
        </span>
      </div>
    }
    const renderArrow = (direction = -1) => {
      const icon: string = direction < 0 ? 'keyboard_arrow_left' : 'keyboard_arrow_right'

      return <GButton flat marginless icon={icon} onClick={() => arrowClickHandler(direction)} />
    }
    const renderHeader = () => {
      return <div class={`${name}__header`}>
        {renderArrow()}
        {renderTitle()}
        {renderArrow(1)}
      </div>
    }

    const renderDaysOfWeek = (cols: boolean) => {
      return daysOfWeek.value.map(day => {
        if (cols) {
          return <col class={`${name}__matrix-col ${name}__matrix-col--${day}`} />
        }

        return <th class={`${name}__matrix-day-of-week`}>{day}</th>
      })
    }
    const renderDay = (day: number | undefined) => {
      if (day) {
        const currentMs = today.getTime()
        const ms = getMSByDay(day)

        const { isActiveDate, isLeftActiveEdge, isRightActiveEdge } = isActiveDay(ms)

        const isActive = isActiveDate || isLeftActiveEdge || isRightActiveEdge || ms === currentMs || false

        return <GButton
          label={day}
          flat={!isActive}
          depressed={isActive}
          outline={ms === currentMs && !isActiveDate}
          color={isActive ? 'primary' : undefined}
          disabled={ms < min.value || ms > max.value}
          onClick={() => pickDateHandler(day)}
          onMouseover={() => hoverDay.value = ms}
          onMouseout={() => hoverDay.value = 0}
          key={`${name}-${uid}-day-${day}`}
          round
          marginless
        />
      }
    }
    const renderWeek = (week: (number | undefined)[]) => {
      return week.map(day => {
        const ms = getMSByDay(day || 0)

        const {
          isInRange,
          isActiveHoverDay,
          isLeftActiveEdge,
          isRightActiveEdge,
          isLeftActiveHoverDate,
          isRightActiveHoverDate
        } = isActiveDay(ms)

        return <td
          class={{
            [`${name}__matrix-day-cell`]: true,
            [`${name}__matrix-day-cell--active`]: day && isInRange,
            [`${name}__matrix-day-cell--active-left`]: day && isLeftActiveEdge,
            [`${name}__matrix-day-cell--active-right`]: day && isRightActiveEdge,
            [`${name}__matrix-day-cell--active-hover`]: day && isActiveHoverDay && props.range,
            [`${name}__matrix-day-cell--active-hover-left`]: day && isLeftActiveHoverDate && !isLeftActiveEdge && props.range,
            [`${name}__matrix-day-cell--active-hover-right`]: day && isRightActiveHoverDate && !isRightActiveEdge && props.range
          }}
        >
          {renderDay(day)}
        </td>
      })
    }
    const renderWeeks = () => {
      return days.value.map((week, index) => {
        return <tr key={`${name}-${uid}-week-${index}`}>{renderWeek(week)}</tr>
      })
    }
    const renderDays = () => {
      if (state.value === 'days') {
        return <table class={`${name}__matrix`}>
          <colgroup>{renderDaysOfWeek(true)}</colgroup>
          <thead><tr>{renderDaysOfWeek(false)}</tr></thead>
          <tbody>{renderWeeks()}</tbody>
        </table>
      }
    }

    const renderMonth = (month: Month) => {
      const isActive = isActiveMonth(date.value.year, month.number)
      const currentYear = today.getFullYear() === date.value.year
      const currentMonth = today.getMonth() === month.number
      const outline = !isActive && currentYear && currentMonth
      const color = isActive || currentYear && currentMonth ? 'primary' : undefined

      return <GButton
        class={`${name}__month`}
        label={month.short}
        flat={!isActive}
        color={color}
        outline={outline}
        block
        rounded
        depressed
        marginless
        onClick={() => {
          date.value.month = month.number
          state.value = 'days'
        }}
        key={`${name}-${uid}-month-${month.number}`}
      />
    }
    const renderMonths = () => {
      if (state.value === 'months') {
        return <div class={`${name}__months`}>
          {months.value.map(month => renderMonth(month))}
        </div>
      }
    }

    const renderYear = (year: number) => {
      const isActive = isActiveYear(year) || year === date.value.year
      const currentYear = year === today.getFullYear()
      const color = isActive || currentYear ? 'primary' : undefined

      return <GButton
        class={{
          [`${name}__year`]: true,
          [`${name}__year--active`]: isActive
        }}

        label={year}
        color={color}
        flat={!isActive}
        outline={currentYear}
        depressed={isActive}

        block
        rounded
        marginless

        onClick={() => {
          date.value.year = year
          state.value = 'months'
        }}

        key={`${name}-${uid}-year-${year}`}
      />
    }
    const renderYears = () => {
      if (state.value === 'years') {
        return <div class={`${name}__years`} ref={yearsRef}>
          {years.value.map(year => renderYear(year))}
        </div>
      }
    }

    return () => <div class={name} ref={rootRef}>
      {renderHeader()}
      {renderDays()}
      {renderMonths()}
      {renderYears()}
    </div>
  }
})
