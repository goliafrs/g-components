import { defineComponent, h, ref } from 'vue'

import { GCard, GDatePicker } from '../..'

export default defineComponent({
  setup() {
    const arrayNumberValue = ref([ 1633640400000 ])
    const arrayNumbersValue = ref([ 1633640400000 ])
    const arrayNumbersValues = ref([ 1633640400000, 1634936400000 ])

    return () => <div>
      <GCard width={282} rounded>
        <GDatePicker v-model={arrayNumberValue.value}></GDatePicker>
      </GCard>
      <GCard width={282} rounded class='ml-3'>
        <GDatePicker v-model={arrayNumbersValue.value} range locale='ru'></GDatePicker>
      </GCard>
      <GCard width={282} rounded class='ml-3'>
        <GDatePicker v-model={arrayNumbersValues.value} range locale='ru'></GDatePicker>
      </GCard>
    </div>
  }
})
