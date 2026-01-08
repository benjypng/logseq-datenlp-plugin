import { createRoot, type Root } from 'react-dom/client'

import { GotoDate } from './GotoDate'

let root: Root | null = null

export const goToDate = (): void => {
  const container = document.getElementById('app')
  if (!container) return

  if (!root) {
    root = createRoot(container)
  }

  root.render(<GotoDate />)

  logseq.App.registerCommandPalette(
    {
      key: 'logseq-datenlp-plugin-gotodate',
      label: 'logseq-datenlp-plugin: Go to date using NLP',
      keybinding: { binding: logseq.settings!.gotoShortcut as string },
    },
    () => {
      logseq.showMainUI({ autoFocus: true })

      requestAnimationFrame(() => {
        document.getElementById('gotodate-field')?.focus()
      })
    },
  )
}
