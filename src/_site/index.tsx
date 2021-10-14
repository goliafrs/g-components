import { defineComponent, h, ref } from 'vue'
import { GAvatar, GButton, GCard, GCheckbox, GChip, GDatePicker, GDialog, GIcon, GProgress } from '../'

export default defineComponent({
  name: 'Home',

  setup() {
    const booleanValue = ref(false)
    const arrayNumberValue = ref([ 1633640400000 ])
    const arrayNumbersValue = ref([ 1633640400000, 1634936400000 ])

    return () => <div class='grid pa-3'>
      <div class=''>
        <GAvatar title='avatar' color='primary'></GAvatar>
        <GAvatar title='avatar' color='error' rounded class='ml-3'></GAvatar>
        <GAvatar title='avatar' color='success' round class='ml-3'></GAvatar>
        <GAvatar title='avatar' color='secondary' round outline class='ml-3'></GAvatar>
      </div>
      <div class=''>
        <GButton color='primary'>GButton</GButton>
        <GButton color='error' rounded>GButton</GButton>
        <GButton color='success' rounded outline>GButton</GButton>
      </div>
      <div class=''>
        <GCard class='pa-3' width={300}>GCard</GCard>
        <GCard class='pa-3 ml-3' rounded width={300}>GCard</GCard>
        <GCard class='pa-3 ml-3' rounded outline width={300}>GCard</GCard>
        <GCard class='pa-3 ml-3' rounded flat color='primary' width={300}>GCard</GCard>
      </div>
      <div class=''>
        <GCheckbox v-model={booleanValue.value}>GCheckbox</GCheckbox>
      </div>
      <div class=''>
        <GIcon value='edit' color='primary'></GIcon>
        <GIcon value='add' color='error' class='ml-3'></GIcon>
        <GIcon value='person' color='success' class='ml-3'></GIcon>
      </div>
      <div class=''>
        <GProgress indeterminate></GProgress>
        <GProgress value={25} class='ml-3'></GProgress>
      </div>
      <div class=''>
        <GProgress indeterminate type='linear'></GProgress>
      </div>
      <div class='faic'>
        <GChip label='GChip' color='primary'></GChip>
        <GChip label='GChip' color='error' icon='clear'></GChip>
        <GChip label='GChip' color='success' icon='done'></GChip>
        <GChip label='GChip' color='success' icon='done' loading></GChip>
      </div>
      <div class=''>
        <GCard width={282} rounded>
          <GDatePicker v-model={arrayNumberValue.value}></GDatePicker>
        </GCard>
        <GCard width={282} rounded class='ml-3'>
          <GDatePicker v-model={arrayNumbersValue.value} range></GDatePicker>
        </GCard>
      </div>
      <div>
        <GDialog v-model={booleanValue.value} maxWidth={400} rounded><div class='pa-3'>test</div></GDialog>
      </div>
    </div>
  }
})
