import { defineComponent } from 'vue'

const name = 'app'

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
      id={name}
      class={{
        [`g-${name}`]: true,
        [`g-${name}--${props.theme}`]: true
      }}
    >
      {slots}
    </div>
  }
})
