import { defineComponent, h, ref } from 'vue'
import { GAvatar, GButton, GCard, GCheckbox, GChip, GDatePicker, GDialog, GDivider, GEmpty, GIcon, GPanel, GPanels, GProgress } from '../'

export default defineComponent({
  name: 'Home',

  setup() {
    const booleanValue = ref(false)
    const modal = ref(false)
    const arrayNumberValue = ref([ 1633640400000 ])
    const arrayNumbersValue = ref([ 1633640400000, 1634936400000 ])

    return () => <div class='grid pa-3'>
      <div>
        <GAvatar title='avatar' color='primary'></GAvatar>
        <GAvatar title='avatar' color='error' rounded class='ml-3'></GAvatar>
        <GAvatar title='avatar' color='success' round class='ml-3'></GAvatar>
        <GAvatar title='avatar' color='secondary' round outline class='ml-3'></GAvatar>
      </div>
      <div>
        <GButton color='primary'>GButton</GButton>
        <GButton color='error' rounded>GButton</GButton>
        <GButton color='success' rounded outline>GButton</GButton>
      </div>
      <div>
        <GCard class='pa-3' width={300}>GCard</GCard>
        <GCard class='pa-3 ml-3' rounded width={300}>GCard</GCard>
        <GCard class='pa-3 ml-3' rounded outline width={300}>GCard</GCard>
        <GCard class='pa-3 ml-3' rounded flat color='primary' width={300}>GCard</GCard>
      </div>
      <div>
        <GCheckbox v-model={booleanValue.value}>GCheckbox</GCheckbox>
        <GCheckbox v-model={booleanValue.value} color='success'>GCheckbox</GCheckbox>
      </div>
      <div>
        <GIcon value='edit' color='primary'></GIcon>
        <GIcon value='add' color='error' class='ml-3'></GIcon>
        <GIcon value='person' color='success' class='ml-3'></GIcon>
      </div>
      <div>
        <GProgress indeterminate></GProgress>
        <GProgress value={25} class='ml-3'></GProgress>
      </div>
      <div>
        <GProgress indeterminate type='linear'></GProgress>
      </div>
      <div class='faic'>
        <GChip label='GChip' color='primary'></GChip>
        <GChip label='GChip' color='error' icon='clear'></GChip>
        <GChip label='GChip' color='success' icon='done'></GChip>
        <GChip label='GChip' color='success' icon='done' loading></GChip>
      </div>
      <div>
        <GCard width={282} rounded>
          <GDatePicker v-model={arrayNumberValue.value}></GDatePicker>
        </GCard>
        <GCard width={282} rounded class='ml-3'>
          <GDatePicker v-model={arrayNumbersValue.value} range></GDatePicker>
        </GCard>
      </div>
      <div>
        <GButton onClick={() => modal.value = !modal.value} label='Modal'></GButton>
        <GDialog v-model={modal.value} maxWidth={400} rounded><div class='pa-3'>test</div></GDialog>
      </div>
      <div>
        <GDivider></GDivider>
        <GDivider color='primary' class='mt-3'></GDivider>
        <GDivider color='error' style='dashed' class='mt-3'></GDivider>
        <GDivider color='success' style='dotted' class='mt-3'></GDivider>
      </div>
      <div>
        <GEmpty />
      </div>
      <div>
        <GPanels>
          <GPanel v-slots={{ header: ({ expanded }) => <div>panel header {expanded}</div> }}>panel 1</GPanel>
          <GPanel v-slots={{ header: ({ expanded }) => <div>panel header {expanded}</div> }}>panel 2</GPanel>
        </GPanels>
      </div>
    </div>
  }
})
