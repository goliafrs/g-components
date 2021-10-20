import { defineComponent, h, ref } from 'vue'

import { GButton, GCardActions, GDialog } from '../..'

export default defineComponent({
  setup() {
    const dialog = ref(false)

    return () => <div>
      <GButton onClick={() => dialog.value = !dialog.value} label='show dialog' rounded />
      <GDialog
        v-model={dialog.value}
        v-slots={{
          header: () => <div class='pa-3'>Header</div>,
          footer: () => <GCardActions class='fjcfe'>
            <GButton label='close' flat rounded onClick={() => dialog.value = false} />
          </GCardActions>
        }}
        maxWidth={400}
        rounded
      >
        <div class='pa-3'>Dialog content.</div>
      </GDialog>
    </div>
  }
})
