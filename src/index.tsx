import '@logseq/libs'

import { completeTask } from '~/features/complete-task'
import { goToDate } from '~/features/go-to-date'
import { manualParsing } from '~/features/parse/manual'
import { parseMutationObserver } from '~/features/parse/semi-auto'
import { settings } from '~/settings'
import { handlePopup } from '~/utils'

import { handleToolbar } from './features/toolbar'

const main = async () => {
  console.info('logseq-datenlp-plugin loaded')
  handlePopup()

  // CHeck if any of the special characters are clashing
  logseq.onSettingsChanged(async () => {
    const { dateChar, scheduledChar, deadlineChar } = logseq.settings!
    const { size } = new Set([dateChar, scheduledChar, deadlineChar])
    if (size === 3) return
    if (size === 2) {
      if (dateChar == scheduledChar && dateChar == 'NA') return
      if (dateChar == deadlineChar && dateChar == 'NA') return
      if (scheduledChar == deadlineChar && scheduledChar == 'NA') return
    }
    if (size === 1 && [dateChar, scheduledChar, deadlineChar].includes('NA'))
      return
    await logseq.UI.showMsg('Fix clashing special characters', 'warning')
  })

  // FEATURE: Go to date
  goToDate()

  // FEATURE: Complete date
  completeTask()

  // FEATURE: Toolbar
  handleToolbar()

  if (logseq.settings!.semiAuto) parseMutationObserver() // enable mutation observer
  manualParsing()
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
