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
    const datePicker = ref<HTMLElement>()
    const yearsList = ref<HTMLElement>()

    const uid = getCurrentInstance()?.uid

    const date = reactive<DateToday>({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate()
    })
    const hoveringDate = ref(0)
    const state = ref<'days' | 'months' | 'years'>('days')
    const proxy = ref(props.modelValue)

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

      for (let year = date.year + props.yearsFill; year >= date.year - props.yearsFill; year--) {
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

    const computedDate = computed(() => {
      const currentDate = new Date(date.year, date.month, date.day)
      const dayOfFirstDate = new Date(date.year, date.month, 1).getDay()
      const dayAmount = new Date(date.year, date.month + 1, 0).getDate()
      const daysMatrix = []

      const diff = dayOfFirstDate - 1
      const prepend = diff < 0 ? 7 + diff : diff

      for (let index = 0; index < prepend; index++) {
        daysMatrix.push(undefined)
      }

      for (let index = 1; index <= dayAmount; index++) {
        daysMatrix.push(index)
      }

      return {
        year: currentDate.getFullYear(),
        month: currentDate.toLocaleString(props.localeTag, { month: 'long' }),
        day: currentDate.toLocaleString(props.localeTag, { day: 'numeric' }),
        days: chunk(daysMatrix, 7),
        months: chunk(months.value, 3)
      }
    })

    const scrollYearsList = (): void => {
      if (state.value === 'years') {
        setTimeout(() => {
          if (datePicker.value && yearsList.value) {
            const activeYearElement: HTMLElement = yearsList.value.querySelector(`.${name}__years-list-item--active`) as HTMLElement
            if (activeYearElement) {
              yearsList.value.scrollTop = activeYearElement.offsetTop - datePicker.value.offsetHeight / 2
            }
          }
        }, 100)
      }
    }
    const arrowClickHandler = (direction = -1): void => {
      if (direction < 0) {
        switch (state.value) {
          case 'years':
            date.year--
            break
          case 'months':
          case 'days':
          default:
            date.month--
            date.day = 1
            break
        }
      }
      if (direction > 0) {
        switch (state.value) {
          case 'years':
            date.year++
            break
          case 'months':
          case 'days':
          default:
            date.month++
            date.day = 1
            break
        }
      }
    }
    const getUnixTimeByDay = (day: number): number => {
      return new Date(date.year, date.month, day).getTime()
    }
    const pickDateHandler = (day: number) => {
      if (day && !isNaN(day)) {
        const pickedDate = getUnixTimeByDay(day)

        date.day = day

        if (props.range && proxy.value.length < 2 && pickedDate !== proxy.value[0]) {
          proxy.value.push(pickedDate)
          proxy.value.sort()
        } else if (!props.range || proxy.value.length === 2) {
          proxy.value = [ pickedDate ]
        }
      }
    }
    const isActiveDay = (unixTime: number): boolean | any => {
      const isActiveDate = proxy.value.some((value: string | number) => {
        if (value) {
          const timeToCompare = value
          if (unixTime === timeToCompare) {
            return true
          }
        }

        return false
      })

      let isInRange = false
      if (proxy.value.length > 1) {
        isInRange = unixTime < proxy.value[1] && unixTime > proxy.value[0]
      }

      let isLeftActiveEdge = false
      let isRightActiveEdge = false

      if (proxy.value.length === 2) {
        const leftEdge = proxy.value[0]
        const rightEdge = proxy.value[1]
        if (leftEdge === unixTime) {
          isLeftActiveEdge = true
        }
        if (rightEdge === unixTime) {
          isRightActiveEdge = true
        }
      }

      return {
        isActiveDate,
        isInRange,
        isLeftActiveEdge,
        isRightActiveEdge
      }
    }
    const isActiveHoverDay = (unixTime: number): boolean => {
      if (hoveringDate.value && proxy.value.length === 1) {
        const value = new Date(proxy.value[0]).getTime()
        const lt = unixTime < Math.max(value, hoveringDate.value)
        const gt = unixTime > Math.min(value, hoveringDate.value)

        return lt && gt
      }

      return false
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

      const currentDate = new Date(proxy.value[0])

      if (proxy.value.length < 2) {
        return currentDate.getFullYear() === year
      }

      const topBorder = currentDate
      const bottomBorder = new Date(proxy.value[1])

      return topBorder.getFullYear() <= year && bottomBorder.getFullYear() >= year
    }
    const isDisabledDay = (unixTime: number): boolean => {
      return unixTime < min.value || unixTime > max.value
    }

    watch(() => props.modelValue, () => {
      proxy.value = proxy.value.reduce<number[]>((result, value) => {
        const date = new Date(value)
        if (date instanceof Date) {
          date.setHours(0, 0, 0, 0)
          result.push(date.getTime())
        }

        return result
      }, [])

      if (proxy.value.length && proxy.value[0] === proxy.value[1]) {
        proxy.value = [ proxy.value[0] ]
      }
    })
    watch(() => proxy, () => {
      proxy.value = props.filter(proxy.value)

      let value
      if (props.range) {
        value = proxy.value
      } else {
        value = [ proxy.value[0] ]
      }

      if (JSON.stringify(props.modelValue) !== JSON.stringify(value)) {
        emit('update:modelValue', value)
      }
    })
    watch(() => state, scrollYearsList)
    watch(() => date, (oldData, newData) => {
      if (oldData.year !== newData.year) {
        scrollYearsList()
      }

      if (date.month < 0) {
        date.year--
        date.month = 11
        date.day = 1
      } else if (date.month > 11) {
        date.year++
        date.month = 0
        date.day = 1
      }
    })

    onMounted(() => {
      if (proxy.value[0]) {
        const value = new Date(proxy.value[0])
        if (value instanceof Date) {
          date.year = value.getFullYear()
          date.month = value.getMonth()
          date.day = value.getDate()
        }
      }
    })

    const renderTitle = () => {
      return <div class={`${name}__title`}>
        <span class={`${name}__title-item ${name}__title-item--day`} onClick={() => state.value = 'days'}>
          {computedDate.value.day}
        </span>
        <span class={`${name}__title-item ${name}__title-item--month`} onClick={() => state.value = 'months'}>
          {computedDate.value.month}
        </span>
        <span class={`${name}__title-item ${name}__title-item--year`} onClick={() => state.value = 'years'}>
          {computedDate.value.year}
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
        const unixTime = getUnixTimeByDay(day)

        const { isActiveDate, isLeftActiveEdge, isRightActiveEdge } = isActiveDay(unixTime)

        const isActive = isActiveDate || isLeftActiveEdge || isRightActiveEdge || unixTime === currentMs || false

        return <GButton
          class={`${name}__matrix-day`}
          label={day}
          flat={!isActive}
          depressed={isActive}
          outline={unixTime === currentMs && !isActiveDate}
          color={isActive ? 'primary' : undefined}
          disabled={isDisabledDay(unixTime)}
          onClick={() => pickDateHandler(day)}
          onMouseover={() => hoveringDate.value = getUnixTimeByDay(day)}
          onMouseout={() => hoveringDate.value = 0}
          key={`${name}-${uid}-day-${day}`}
          round
        />
      }
    }
    const renderWeek = (week: (number | undefined)[]) => {
      return week.map(day => {
        const unixTime = getUnixTimeByDay(day || 0)

        const { isInRange, isLeftActiveEdge, isRightActiveEdge } = isActiveDay(unixTime)

        let isLeftActiveHoverDate = false
        let isRightActiveHoverDate = false

        const arrTimeForHover = []

        if (hoveringDate.value) {
          arrTimeForHover.push(proxy.value[0])
          arrTimeForHover.push(hoveringDate.value)
        }

        arrTimeForHover.sort()

        if (arrTimeForHover.length === 2 && proxy.value.length === 1) {
          if (unixTime === arrTimeForHover[0]) {
            isLeftActiveHoverDate = true
          }
          if (unixTime === arrTimeForHover[1]) {
            isRightActiveHoverDate = true
          }
        }

        return <td
          class={{
            [`${name}__matrix-day-cell`]: true,
            [`${name}__matrix-day-cell--active`]: day && isInRange,
            [`${name}__matrix-day-cell--active-left`]: day && isLeftActiveEdge,
            [`${name}__matrix-day-cell--active-right`]: day && isRightActiveEdge,
            [`${name}__matrix-day-cell--active-hover`]: day && isActiveHoverDay(unixTime) && props.range,
            [`${name}__matrix-day-cell--active-hover-left`]: day && isLeftActiveHoverDate && !isLeftActiveEdge && props.range,
            [`${name}__matrix-day-cell--active-hover-right`]: day && isRightActiveHoverDate && !isRightActiveEdge && props.range
          }}

          key={`${name}-${uid}-day-cell-${day}`}
        >
          {renderDay(day)}
        </td>
      })
    }
    const renderWeeks = () => {
      return computedDate.value.days.map((week, index) => {
        return <tr key={`${name}-${uid}-week-${index}`}>{renderWeek(week)}</tr>
      })
    }
    const renderDaysMatrix = () => {
      if (state.value === 'days') {
        return <div class={`${name}__holder`}>
          <table class={`${name}__matrix`}>
            <colgroup>{renderDaysOfWeek(true)}</colgroup>
            <thead><tr>{renderDaysOfWeek(false)}</tr></thead>
            <tbody>{renderWeeks()}</tbody>
          </table>
        </div>
      }
    }

    const renderMonth = (month: Month) => {
      const isActive = isActiveMonth(date.year, month.number)
      const currentYear = today.getFullYear() === date.year
      const currentMonth = today.getMonth() === month.number
      const outline = !isActive && currentYear && currentMonth
      const color = isActive || currentYear && currentMonth ? 'primary' : undefined

      return <GButton
        class={`${name}__matrix-month`}
        label={month.short}
        flat={!isActive}
        color={color}
        outline={outline}
        rounded
        block
        depressed
        onClick={() => {
          date.month = month.number
          state.value = 'days'
        }}
        key={`${name}-${uid}-month-${month.number}`}
      />
    }
    const renderQuarter = (quarter: Month[]) => {
      return quarter.map(month => {
        return <td class={`${name}__matrix-month-cell`} key={`${name}-${uid}-month-cell-${month.number}`}>{renderMonth(month)}</td>
      })
    }
    const renderQuarters = () => {
      return computedDate.value.months.map((quarter, index) => {
        return <tr key={`${name}-${uid}-quarter-${index}`}>{renderQuarter(quarter)}</tr>
      })
    }
    const renderMonthsMatrix = () => {
      if (state.value === 'months') {
        return <div class={`${name}__holder`}>
          <table class={`${name}__matrix`}>
            <tbody>
              {renderQuarters()}
            </tbody>
          </table>
        </div>
      }
    }

    const renderYears = () => {
      return years.value.map(year => {
        return <GListItem
          class={{
            [`${name}__years-list-item`]: true,
            [`${name}__years-list-item--active`]: year === date.year,
            [`${name}__years-list-item--current`]: year === today.getFullYear(),
            [`${name}__years-list-item--selected`]: isActiveYear(year)
          }}

          label={year}
          active={date.year === year}

          onClick={() => {
            date.year = year
            state.value = 'months'
          }}

          key={`${name}-${uid}-year-${year}`}
        />
      })
    }
    const renderYearsList = () => {
      if (state.value === 'years') {
        return <div class={`${name}__years-list`} ref={yearsList}>
          <GList>
            {renderYears()}
          </GList>
        </div>
      }
    }

    return () => <div class={`${name}`} ref={datePicker}>
      {renderHeader()}
      {renderDaysMatrix()}
      {renderMonthsMatrix()}
      {renderYearsList()}
    </div>
  }
})
