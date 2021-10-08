<template>
  <button
    :tabindex="tabindex"

    :disabled="disabled"
    :autofocus="autofocus"

    :name="name"
    :type="type"

    :class="classes"

    @click="onClick"
  >
    <div v-if="loading" class="g-button__loading">
      <GProgress indeterminate :size="24" />
    </div>

    <div v-if="icon" class="g-button__icon">
      <GIcon :value="icon" :size="size" />
    </div>

    <div v-if="label" class="g-button__content">
      {{ label }}
    </div>
  </button>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, h } from 'vue'

export const name = 'g-button'

export default defineComponent({
  name,

  props: {
    label: {
      type: [ String, Number ],
      default: undefined
    },

    color: {
      type: String,
      default: undefined
    },

    small: Boolean,
    large: Boolean,

    fab: Boolean,
    flat: Boolean,
    block: Boolean,
    round: Boolean,
    rounded: Boolean,
    toolbar: Boolean,
    outline: Boolean,
    depressed: Boolean,

    icon: {
      type: String,
      default: undefined
    },

    fixed: Boolean,
    absolute: Boolean,

    top: Boolean,
    bottom: Boolean,
    left: Boolean,
    right: Boolean,

    loading: Boolean,

    disabled: Boolean,
    autofocus: Boolean,

    name: {
      type: String,
      default: undefined
    },

    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },

    tabindex: {
      type: [ String, Number ],
      default: undefined
    },

    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: () => undefined
    }
  },

  setup(props, { slots }) {
    const classes = {
      [`${name}`]: true,

      [`${name}--small`]: props.small,
      [`${name}--large`]: props.large,

      [`${name}--fab`]: props.fab,
      [`${name}--flat`]: props.flat,
      [`${name}--block`]: props.block,
      [`${name}--round`]: props.round ? true : !!props.icon && !props.label,
      [`${name}--rounded`]: props.rounded,
      [`${name}--outline`]: props.outline,
      [`${name}--depressed`]: props.depressed,

      [`${name}--toolbar`]: props.toolbar,

      [`${name}--fixed`]: props.fixed,
      [`${name}--absolute`]: props.absolute,

      [`${name}--top`]: props.top,
      [`${name}--bottom`]: props.bottom,
      [`${name}--left`]: props.left,
      [`${name}--right`]: props.right,

      [`${name}--disabled`]: props.disabled,
      [`${name}--loading`]: props.loading,

      [`${name}--${props.type}`]: !!props.type,
      [`${name}--${props.color}`]: !!props.color
    }

    return {
      classes,
      size: computed(() => props.small ? 18 : props.large ? 26 : props.fab ? 30 : 22)
    }
  }
})
</script>
