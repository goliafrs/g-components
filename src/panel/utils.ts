import { InjectionKey } from 'vue'

import { PanelGroupInjection } from './interface'

export const panelGroupInjection: InjectionKey<PanelGroupInjection> = Symbol('panel-group-injection')
