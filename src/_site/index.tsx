import { defineComponent, h, ref } from 'vue'
import { GAvatar, GButton, GCard, GCardActions, GCheckbox, GChip, GDatePicker, GDialog, GDivider, GEmpty, GIcon, GList, GPanel, GPanelGroup, GProgress, GSpoiler } from '../'

import { ListItem } from '../list/src/ListItem'
import { GModal } from '../modal'
import { componentNames, icons } from '../utils'

export default defineComponent({
  name: 'Home',

  setup() {
    const name = ref(window.localStorage.getItem('name'))
    const booleanValue = ref(false)
    const dialog = ref(false)
    const modal = ref(false)
    const arrayNumberValue = ref([ 1633640400000 ])
    const arrayNumbersValue = ref([ 1633640400000 ])
    const arrayNumbersValues = ref([ 1633640400000, 1634936400000 ])

    const renderIcons = () => {
      return icons.map(icon => {
        return <span class='pa-2'><GIcon value={icon}></GIcon></span>
      })
    }
    const renderList = () => {
      const items = componentNames.map((componentName: string): ListItem => {
        return {
          label: componentName,
          active: name.value === componentName,
          onClick: () => {
            name.value = componentName
            window.localStorage.setItem('name', componentName)
          }
        }
      })

      return <GList items={items}></GList>
    }
    const renderComponents = () => {
      switch (name.value) {
        case 'avatar': {
          return <div>
            <GAvatar title='avatar' color='primary'></GAvatar>
            <GAvatar title='avatar' color='error' rounded class='ml-3'></GAvatar>
            <GAvatar title='avatar' color='success' round class='ml-3'></GAvatar>
            <GAvatar title='avatar' color='secondary' round outline class='ml-3'></GAvatar>
          </div>
        }
        case 'button': {
          return <div>
            <GButton color='primary'>GButton</GButton>
            <GButton color='error' rounded>GButton</GButton>
            <GButton color='success' rounded outline>GButton</GButton>
          </div>
        }
        case 'card': {
          return <div>
            <GCard class='pa-3' width={300}>GCard</GCard>
            <GCard class='pa-3 ml-3' rounded width={300}>GCard</GCard>
            <GCard class='pa-3 ml-3' rounded outline width={300}>GCard</GCard>
            <GCard class='pa-3 ml-3' rounded flat color='primary' width={300}>GCard</GCard>
          </div>
        }
        case 'checkbox': {
          return <div>
            <GCheckbox v-model={booleanValue.value}>GCheckbox</GCheckbox>
            <GCheckbox v-model={booleanValue.value} color='success'>GCheckbox</GCheckbox>
          </div>
        }
        case 'chip': {
          return <div class='faic'>
            <GChip label='GChip' color='primary'></GChip>
            <GChip label='GChip' color='error' icon='clear'></GChip>
            <GChip label='GChip' color='success' icon='done'></GChip>
            <GChip label='GChip' color='success' icon='done' loading></GChip>
          </div>
        }
        case 'date-picker': {
          return <div>
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
        case 'dialog': {
          return <div>
            <GButton onClick={() => dialog.value = !dialog.value} label='show dialog' rounded marginless></GButton>
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
        case 'divider': {
          return <div>
            <GDivider></GDivider>
            <GDivider color='primary' class='mt-3'></GDivider>
            <GDivider color='error' style='dashed' class='mt-3'></GDivider>
            <GDivider color='success' style='dotted' class='mt-3'></GDivider>
          </div>
        }
        case 'empty': {
          return <div>
            <GEmpty />
          </div>
        }
        case 'icon': {
          return <div>
            {renderIcons()}
          </div>
        }
        case 'list': {
          return <div>
            <GList items={[
              { label: 'item 1' },
              { label: 'item 2' },
              { label: 'item 3' },
              { label: 'item 4' }
            ]}></GList>
          </div>
        }
        case 'modal': {
          return <div>
            <GButton onClick={() => modal.value = !modal.value} label='show modal' rounded marginless></GButton>
            <GModal v-model={modal.value} rounded>
              <div class='pa-3'>Modal content.</div>
            </GModal>
          </div>
        }
        case 'panel-group': {
          return <div>
            <GPanelGroup>
              <GPanel v-slots={{ header: ({ expanded }) => <div>panel header {expanded}</div> }}>panel 1</GPanel>
              <GPanel v-slots={{ header: ({ expanded }) => <div>panel header {expanded}</div> }}>panel 2</GPanel>
            </GPanelGroup>
          </div>
        }
        case 'panel': {
          return <div>
            <GPanel v-slots={{ header: ({ expanded }) => <div>panel header {expanded}</div> }}>panel 1</GPanel>
          </div>
        }
        case 'progress': {
          return <div class='grid grid-cols-1'>
            <div>
              <GProgress indeterminate color='primary'></GProgress>
              <GProgress value={25} class='ml-3' color='error'></GProgress>
              <GProgress value={50} class='ml-3' color='success' info></GProgress>
            </div>
            <div class='grid grid-cols--1'>
              <GProgress indeterminate color='primary' type='linear'></GProgress>
              <GProgress indeterminate color='error' type='linear' ></GProgress>
              <GProgress indeterminate color='success' type='linear' ></GProgress>
              <GProgress color='primary' type='linear' value={25} ></GProgress>
              <GProgress color='primary' type='linear' value={50} info></GProgress>
            </div>
          </div>
        }
        case 'spoiler': {
          return <div>
            <GSpoiler title='spoiler' text='text'></GSpoiler>
          </div>
        }
      }
    }

    return () => <div>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '300px'
      }}>{renderList()}</div>
      <div class='pt-3 pb-3 pr-3' style={{ paddingLeft: '316px' }}>
        <h2
          class='ma-0 py-3 w--100 bgc--white'
          style={{
            position: 'fixed',
            top: 0,
            left: '316px'
          }}
        >{name.value}</h2>
        <div style={{ paddingTop: '61px' }}>{renderComponents()}</div>
      </div>
    </div>
  }
})