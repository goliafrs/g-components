import { defineComponent, h, ref } from 'vue'

import { GButton, GCard, GDropdown, GList } from '../..'

export default defineComponent({
  setup() {
    const proxy = ref(false)

    const slots = (disabled: boolean) => {
      return {
        activator: () => <GButton onClick={() => proxy.value = !proxy.value} label='show dropdown' color='primary' disabled={disabled} flat rounded />,
        default: () => <GCard>
          <GList
            items={[
              { label: 'item 1' },
              { label: 'item 2' },
              {
                label: 'item 3',
                group: true,
                items: [
                  { label: 'item 1' },
                  { label: 'item 2' },
                  {
                    label: 'item 3',
                    group: true,
                    items: [
                      { label: 'item 1' },
                      { label: 'item 2' }
                    ]
                  }
                ]
              },
              { label: 'item 4' }
            ]}
          ></GList>
        </GCard>
      }
    }

    return () => <div>
      <GCard width={300} rounded outline class='pa-3'><GDropdown v-slots={slots(false)} /></GCard>
      <GCard width={300} rounded outline class='pa-3 ml-3'><GDropdown v-slots={slots(true)} disabled /></GCard>
    </div>
  }
})
