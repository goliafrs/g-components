import { defineComponent, h, ref } from 'vue'

import { GButton, GContent, GDivider, GList, GSidebar } from '../'

import { componentNames } from '../utils'

import { ButtonProps } from '../button/interface'
import { ComponentName } from '../utils/interface'

import { default as Avatar } from './components/avatar'
import { default as Button } from './components/button'
import { default as Card } from './components/card'
import { default as Checkbox } from './components/checkbox'
import { default as Chip } from './components/chip'
import { default as DatePicker } from './components/date-picker'
import { default as Dialog } from './components/dialog'
import { default as Divider } from './components/divider'
import { default as Dropdown } from './components/dropdown'
import { default as Empty } from './components/empty'
import { default as Footer } from './components/footer'
import { default as Form } from './components/form'
import { default as Icon } from './components/icon'
import { default as Input } from './components/input'
import { default as List } from './components/list'
import { default as ListItem } from './components/list-item'
import { default as Modal } from './components/modal'
import { default as Overlay } from './components/overlay'
import { default as PanelGroup } from './components/panel-group'
import { default as Panel } from './components/panel'
import { default as Progress } from './components/progress'
// import { default as Select } from './components/select'
import { default as Sidebar } from './components/sidebar'
import { default as Snackbar } from './components/snackbar'
import { default as Spoiler } from './components/spoiler'
import { default as Switch } from './components/switch'
import { default as Table } from './components/table'

export default defineComponent({
  name: 'Home',

  setup() {
    const name = ref(window.localStorage.getItem('name'))
    const proxy = ref<boolean>(false)

    const renderList = () => {
      const items = componentNames.map((componentName: ComponentName): ButtonProps => {
        const isActive = name.value === componentName

        return {
          label: componentName,
          color: isActive ? 'primary' : undefined,
          depressed: isActive,
          flat: !isActive,
          size: 'small',
          rounded: true,
          onClick: () => {
            name.value = componentName
            window.localStorage.setItem('name', componentName)
          }
        }
      })

      return <div
        class='grid grid-gap--8 fjcc'
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 110px))' }}
      >{items.map(props => <GButton {...props} />)}</div>
    }
    const renderComponents = () => {
      switch (name.value) {
        case 'avatar': return <Avatar />
        case 'button': return <Button />
        case 'card': return <Card />
        case 'checkbox': return <Checkbox />
        case 'chip': return <Chip />
        case 'date-picker': return <DatePicker />
        case 'dialog': return <Dialog />
        case 'divider': return <Divider />
        case 'dropdown': return <Dropdown />
        case 'empty': return <Empty />
        case 'footer': return <Footer />
        case 'form': return <Form />
        case 'icon': return <Icon />
        case 'input': return <Input />
        case 'list': return <List />
        case 'list-item': return <ListItem />
        case 'modal': return <Modal />
        case 'overlay': return <Overlay />
        case 'panel-group': return <PanelGroup />
        case 'panel': return <Panel />
        case 'progress': return <Progress />
        // case 'select': return <Select />
        case 'sidebar': return <Sidebar v-model={proxy.value} />
        case 'snackbar': return <Snackbar />
        case 'spoiler': return <Spoiler />
        case 'switch': return <Switch />
        case 'table': return <Table />
      }
    }

    return () => <div>
      <GSidebar v-model={proxy.value}>
        <GList items={[
          { label: '1' },
          { label: '1' },
          { label: '1' },
          { label: '1' }
        ]}></GList>
      </GSidebar>
      <GContent>
        <div class='pa-2'>{renderList()}</div>
        <div class='grid grid-cols-1 pa-2'>
          <div
            class='grid faic'
            style={{ gridTemplateColumns: '1fr 200px 1fr' }}
          >
            <GDivider></GDivider>
            <div class='fz-24 text--grey' style={{ textAlign: 'center' }}>{name.value}</div>
            <GDivider></GDivider>
          </div>
          {renderComponents()}
        </div>
      </GContent>
    </div>
  }
})
