import { defineComponent, h, ref } from 'vue'

export const name = 'g-list-item'

export default defineComponent({
  name,

  setup(props, { slots }) {
    const proxy = ref(false)

    const clickHandler = (event: MouseEvent) => {
      event.stopPropagation()
      proxy.value = !proxy.value
    }

    const renderActivator = () => {
      if (slots.activator) {
        return <div class={`${name}__activator`} onClick={clickHandler}>
          {slots.activator()}
        </div>
      }
    }
    const renderContent = () => {
      if (slots.default) {
        return <div class={`${name}__content`}>
          {slots.default()}
        </div>
      }
    }

    return () => <div
      role='group'

      class={{
        [`${name}`]: true,

        [`${name}--active`]: proxy.value
      }}
    >
      {renderActivator()}
      {renderContent()}
    </div>
  }
})
