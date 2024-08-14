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
  logseq.onSettingsChanged(() => {
    const { dateChar, scheduledChar, deadlineChar } = logseq.settings!
    const specialChars = [dateChar, scheduledChar, deadlineChar]
    const uniqueChars = new Set(specialChars)
    let hasClash = false
    if (uniqueChars.size == 1 && !uniqueChars.has('NA')) {
      hasClash = true
    }
    if (uniqueChars.size == 2 && !uniqueChars.has('NA')) {
      hasClash = true
    }
    if (hasClash) {
      logseq.UI.showMsg('Special characters clash', 'error')
    }
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
