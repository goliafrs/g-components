import { defineComponent, h } from 'vue'

const name = 'g-app'

export default defineComponent({
  name,

  props: {
    theme: {
      type: String,
      default: 'light',
      validator: (value: string) => {
        return !!~[ 'light', 'dark' ].indexOf(value)
      }
    }
  },

  render() {
    return h(
      'div',
      {
        attrs: { id: 'app' },
        class: {
          [`${name}`]: true,
          [`${name}--${this.theme}`]: true
        }
      },
      { default: () => this.$slots.default ? this.$slots.default() : undefined }
    )
  }
})
