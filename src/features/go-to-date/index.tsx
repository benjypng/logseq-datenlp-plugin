import { createRoot } from 'react-dom/client'

import { GotoDate } from './GotoDate'

export const goToDate = (): void => {
  logseq.App.registerCommandPalette(
    {
      key: 'logseq-datenlp-plugin-gotodate',
      label: '@Goto date using NLP',
      keybinding: { binding: logseq.settings!.gotoShortcut },
    },
    () => {
      createRoot(document.getElementById('app')!).render(<GotoDate />)
      logseq.showMainUI({ autoFocus: true })

      // Register keypress in popup
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key !== 'Escape') {
          const searchField: HTMLInputElement =
            document.querySelector('.search-field')!
          searchField.focus()
        }
      })
    },
  )
}
