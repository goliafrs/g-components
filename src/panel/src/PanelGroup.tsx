import { VNode, VNodeChild, defineComponent, getCurrentInstance, h, nextTick, onMounted, onUpdated, ref } from 'vue'

export const name = 'g-panel-group'

export default defineComponent({
  name,

  props: {
    flat: Boolean,
    outline: Boolean,
    rounded: Boolean
  },

  setup(props, { slots }) {
    const instance = getCurrentInstance()
    const events = ref()

    const getPanel = (element: VNode) => {
      if (element.type && element.type.name === 'g-panel') {
        return element
      }
    }
    const toggle = () => {
      console.log('instance', instance)
      if (slots.default) {
        for (const node of slots.default()) {
          const panel = getPanel(node)
          console.log('getPanel', panel)
          console.log('getPanel toggle', panel.toggle)
          console.log('node', node)
          console.log('node type', node.type)
          const child = ref(node)
          console.log(child.value)
        }
      }
    }

    onMounted(() => nextTick(toggle))
    onUpdated(() => nextTick(toggle))

    return () => <div
      class={{
        [name]: true,

        [`${name}--${props.flat}`]: props.flat,
        [`${name}--${props.outline}`]: props.outline,
        [`${name}--${props.rounded}`]: props.rounded
      }}
    >
      {slots.default ? slots.default() : undefined}
    </div>
  }
})
