import { defineComponent } from 'vue'

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
    return <div
      id='app'
      class={{
        [`${name}`]: true,
        [`${name}--${this.theme}`]: true
      }}
    >
      {this.$slots.default ? this.$slots.default() : undefined}
    </div>
  }
})
