import { chunk } from 'lodash'

import { PropType, computed, defineComponent, getCurrentInstance, h, onMounted, reactive, ref, watch } from 'vue'
import { GButton, GIcon, GProgress } from 'g-components'

export const name = 'g-date-picker'

export interface DateToday {
  year: number,
  month: number,
  day: number
}

const today = new Date()
today.setHours(0, 0, 0, 0)

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: null,
      default: undefined
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
      default: true
    },

    filter: {
      type: Function,
      default: (value: any) => value
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const defaultDate = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate()
    } as DateToday
    const date: DateToday = reactive<DateToday>(defaultDate)
    const hoveringDate = ref(0)
    const yearsList = ref(null)
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
    const months = computed((): any[] => {
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
        date: currentDate,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate(),
        daysMatrix: chunk(daysMatrix, 7),
        monthsMatrix: chunk(months.value, 3)
      }
    })

    const chosenDate = computed((): DateToday | void => {
      const value = new Date(props.modelValue[0])
      if (value instanceof Date) {
        return {
          year: value.getFullYear(),
          month: value.getMonth(),
          day: value.getDate()
        }
      }

      return undefined
    })

    const scrollYearsList = (): void => {
      if (state.value === 'years') {
        setTimeout(() => {
          if (yearsList.value) {
            yearsList.value.scrollTop = props.yearsList.querySelector('.g-date-picker__years-list-item--active').offsetTop - props.datePicker.offsetHeight / 2
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
    const convertDate = (date: string | number): number => {
      const result = new Date(date)
      result.setHours(0, 0, 0, 0)

      return result.getTime()
    }
    const isActiveDay = (unixTime: number): boolean | any => {
      const isActiveDate = proxy.value.some((value: string | number) => {
        if (value) {
          const timeToCompare = convertDate(value)
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
        const leftEdge = convertDate(proxy.value[0])
        const rightEdge = convertDate(proxy.value[1])
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
        const lt = unixTime < Math.max(proxy.value[0], hoveringDate.value)
        const gt = unixTime > Math.min(proxy.value[0], hoveringDate.value)

        return lt && gt
      }

      return false
    }
    const isActiveMonth = (year: number, month: number): boolean => {
      if (!proxy.value.length) {
        return false
      }

      const monthForCheck = new Date(year, month)

      if (proxy.value.length < 2) {
        return (
          new Date(proxy.value[0]).getMonth() === monthForCheck.getMonth() &&
          new Date(proxy.value[0]).getFullYear() === monthForCheck.getFullYear()
        )
      }

      const leftBorder = new Date(proxy.value[0])
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

      if (proxy.value.length < 2) {
        return new Date(proxy.value[0]).getFullYear() === year
      }

      const topBorder = new Date(proxy.value[0])
      const bottomBorder = new Date(proxy.value[1])

      return topBorder.getFullYear() <= year && bottomBorder.getFullYear() >= year
    }
    const isDisabledDay = (unixTime: number): boolean => {
      return unixTime < min.value || unixTime > max.value
    }

    watch(() => props.modelValue, () => {
      if (!Array.isArray(proxy)) {
        proxy.value = [ proxy ]
      }

      proxy.value = proxy.value.reduce((result, value) => {
        if (value) {
          const date = new Date(value)
          if (date instanceof Date) {
            date.setHours(0, 0, 0, 0)
            result.push(date.getTime())
          }
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
        value = proxy.value[0]
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
      if (chosenDate.value) {
        date.year = chosenDate.value.year
        date.month = chosenDate.value.month
        date.day = chosenDate.value.day
      }
    })

    const renderTitle = () => {
      return <div class={`${name}__title`}>
        <div class={`${name}__title-item ${name}__title-item--day`} onClick={() => state.value = 'days'}>
          {new Date(computedDate.value.date).toLocaleString(props.localeTag, { day: 'numeric' })}
        </div>
        <div class={`${name}__title-item ${name}__title-item--month`} onClick={() => state.value = 'months'}>
          {new Date(computedDate.value.date).toLocaleString(props.localeTag, { month: 'long' })}
        </div>
        <div class={`${name}__title-item ${name}__title-item--year`} onClick={() => state.value = 'years'}>
          {computedDate.value.year}
        </div>
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

    const renderDay = (day: number) => {
      const currentMs: number = today.getTime()
      const unixTime: number = getUnixTimeByDay(day)

      const { isActiveDate, isLeftActiveEdge, isRightActiveEdge } = isActiveDay(unixTime)

      const isActive = isActiveDate || isLeftActiveEdge || isRightActiveEdge || unixTime === currentMs || false

      if (day) {
        return <GButton
          class={`${name}__matrix-day`}
          label={day}
          flat={!isActive}
          depressed={isActive}
          outline={unixTime === currentMs && !isActiveDate}
          color={isActive ? 'primary' : 'transparent'}
          disabled={isDisabledDay(unixTime)}
          onClick={() => pickDateHandler(day)}
          onMouseover={() => hoveringDate.value = getUnixTimeByDay(day)}
          onMouseout={() => hoveringDate.value = 0}
          key={`${name}-day-${day}`}
          round
        />
      }
    }
    const renderDaysOfWeek = (cols: boolean) => {
      if (cols) {
        return daysOfWeek.value.map(day => {
          return <col class={`${name}__matrix-col ${name}__matrix-col--${day}`} />
        })
      }

      return <tr class={`${name}__matrix-day-of-week`}>{day}</tr>
    }
    const renderDays = () => {
      if (state.value === 'days') {
        return <div class={`${name}__holder`}>
          <table class={`${name}__matrix`}>
            <colgroup>
              {renderDaysOfWeek(true)}
            </colgroup>
            <thead>
              <tr>
                {renderDaysOfWeek(false)}
              </tr>
            </thead>
          </table>
        </div>
      }
    }

    return () => <div>

    </div>
  }
})
