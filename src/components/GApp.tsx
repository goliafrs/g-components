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

  setup(props, { slots }) {
    return () => <div
      id='app'
      class={{
        [`${name}`]: true,
        [`${name}--${props.theme}`]: true
      }}
    >
      {slots}
    </div>
  }
})
