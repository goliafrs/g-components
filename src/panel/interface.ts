import { Ref } from 'vue'

export interface PanelGroupInjection {
  expandedPanels: Ref<(string | number)[]>,
  togglePanel: (panelRef: string | number, expanded: boolean) => void
}
