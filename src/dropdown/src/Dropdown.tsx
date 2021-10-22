import { PropType, Ref, computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue'
import { Instance, ModifierArguments, Options, Placement, PositioningStrategy, createPopper } from '@popperjs/core'

import { numberToPxOrString } from '../../utils'

export const name = 'g-dropdown'

export default defineComponent({
  name,

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    attach: {
      type: null,
      default: undefined
    },

    placement: {
      type: String as PropType<Placement>,
      default: 'bottom-start',
      validator: (value: string): boolean => {
        return !!~[
          'auto',
          'auto-start',
          'auto-end',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end'
        ].indexOf(value)
      }
    },
    fallbackPlacements: {
      type: Array as PropType<Placement[]>,
      default: () => [ 'top-start' ]
    },

    strategy: {
      type: String as PropType<PositioningStrategy>,
      default: 'absolute',
      validator: (value: string): boolean => {
        return !!~[ 'absolute', 'fixed' ].indexOf(value)
      }
    },

    offsetSkidding: {
      type: Number,
      default: 0
    },
    offsetDistance: {
      type: Number,
      default: 16
    },

    disabled: {
      type: Boolean,
      default: false
    },

    closeOnContentClick: {
      type: Boolean,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      default: true
    },

    sameWidth: {
      type: Boolean,
      default: true
    },

    minHeight: {
      type: [ String, Number ],
      default: 0
    },
    maxHeight: {
      type: [ String, Number ],
      default: 300
    },
    height: {
      type: [ String, Number ],
      default: 'auto'
    },
    minWidth: {
      type: [ String, Number ],
      default: 0
    },
    maxWidth: {
      type: [ String, Number ],
      default: 300
    },
    width: {
      type: [ String, Number ],
      default: '100%'
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit, slots }) {
    const activatorRef = ref<HTMLElement>()
    const contentRef = ref<HTMLElement>()
    const rootRef = ref<HTMLElement>()

    const proxy = ref<boolean>(props.modelValue)
    const popper = ref<Instance>()

    const options = computed<Options>(() => {
      return {
        placement: props.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: (): number[] => [ props.offsetSkidding, props.offsetDistance ]
            }
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: props.fallbackPlacements,
              altBoundary: true
            }
          },
          {
            name: 'offsetModifier',
            enabled: true,
            phase: 'beforeWrite',
            requires: [ 'computeStyles', 'offset' ],
            fn: ({ state }: ModifierArguments<Options>) => {
              const { options, elements } = state

              const reference = elements.reference
              if (options.strategy === 'fixed') {
                const transformCoordinates = getTargetCoordinates(reference)
                if (transformCoordinates) {
                  const referenceCoordinates = reference.getBoundingClientRect()

                  const offsetX = state?.modifiersData?.offset?.[state.placement]?.x || 0
                  const offsetY = state?.modifiersData?.offset?.[state.placement]?.y || 0
                  const x = referenceCoordinates.x - transformCoordinates.x + offsetX
                  const y = referenceCoordinates.y - transformCoordinates.y + offsetY

                  state.styles.popper.transform = `translate(${x}px, ${y}px)`
                }
              }
            }
          },
          {
            name: 'sameWidth',
            enabled: props.sameWidth,
            phase: 'beforeWrite',
            requires: [ 'computeStyles' ],
            fn: ({ state }) => {
              state.styles.popper.width = `${state.rects.reference.width}px`
            },
            effect: ({ state }) => {
              const reference = state.elements.reference as HTMLElement
              state.elements.popper.style.width = `${reference.offsetWidth}px`
            }
          }
        ],
        strategy: props.strategy
      }
    })

    watch(() => proxy.value, () => {
      emit('update:modelValue', proxy.value)
      popper.value?.update()
    })

    const isChildOf = (target: any, parent: HTMLElement | undefined): boolean => {
      if (parent && parent.contains) {
        return parent.contains(target)
      }

      let element = target
      while (element != null) {
        if (element == parent) {
          return true
        }
        element = element.parentNode
      }

      return false
    }
    const clickHandler = (event: MouseEvent) => {
      if (!props.disabled && !isChildOf(event.target, rootRef.value)) {
        proxy.value = false
      }
    }
    const getTargetCoordinates = (target: any): any => {
      let styles
      let condition = target
      while (condition) {
        styles = window.getComputedStyle(target)
        if (styles.transform !== 'none') {
          return target.getBoundingClientRect()
        }

        condition = target.parentElement
      }
    }

    onMounted(() => {
      if (props.closeOnClick) {
        document.addEventListener('click', clickHandler)
      }

      nextTick(() => {
        if (activatorRef.value && contentRef.value) {
          popper.value = createPopper(
            props.attach || activatorRef.value,
            contentRef.value,
            options.value
          )
        }
      })
    })
    onUpdated(() => {
      popper.value?.update()
    })
    onBeforeUnmount(() => {
      if (props.closeOnClick) {
        document.removeEventListener('click', clickHandler)
      }
      popper.value?.destroy()
    })

    const activatorClickHandler = () => {
      if (!props.disabled) {
        proxy.value = !proxy.value
      }
    }
    const contentClickHandler = (event: MouseEvent) => {
      if (props.closeOnContentClick) {
        event.stopPropagation()
        if (!props.disabled) {
          proxy.value = false
        }
      }
    }

    const renderActivator = () => {
      return <div class={`${name}__activator`} ref={activatorRef} onClick={activatorClickHandler}>
        {slots.activator ? slots.activator() : undefined}
      </div>
    }
    const renderContent = () => {
      return <div
        v-show={proxy.value}

        class={`${name}__content`}
        style={{
          minHeight: numberToPxOrString(props.minHeight),
          maxHeight: numberToPxOrString(props.maxHeight),
          height: numberToPxOrString(props.height),
          minWidth: numberToPxOrString(props.minWidth),
          maxWidth: numberToPxOrString(props.maxWidth),
          width: numberToPxOrString(props.width)
        }}

        ref={contentRef}
        onClick={contentClickHandler}
      >
        {slots.default ? slots.default() : undefined}
      </div>
    }

    return () => <div
      class={{
        [name]: true,
        [`${name}--disabled`]: props.disabled
      }}
      ref={rootRef}
    >
      {renderActivator()}
      {renderContent()}
    </div>
  }
})
