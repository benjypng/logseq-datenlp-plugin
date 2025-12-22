import '@logseq/libs'

import { completeTask } from '~/features/complete-task'
import { goToDate } from '~/features/go-to-date'
import {
  parseMutationObserver,
  startInlineParsing,
} from '~/features/parse/semi-auto'
import { settings } from '~/settings'

import { handleToolbar } from './features/toolbar'
import { handlePopupAndInputFocus } from './utils'

const main = async () => {
  await logseq.UI.showMsg('logseq-datenlp-plugin loaded')

  // Check if DB version is being used
  const isDb = await logseq.App.checkCurrentIsDbGraph()

  handlePopupAndInputFocus()

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
  // Works in DB version
  goToDate()

  // FEATURE: Complete date
  // Does not work in DB version
  if (!isDb) completeTask()

  // FEATURE: Toolbar
  // Does not work properly as the FE has changed
  if (!isDb) handleToolbar()

  //TODO: Can remove SCHEDULED and DEADLINE features as Logseq 0.11.* already has NLP features

  // FEATURE: Semi-auto parsing
  //if (logseq.settings!.semiAuto) parseMutationObserver() // enable mutation observer
  if (logseq.settings!.semiAuto) startInlineParsing() // enable mutation observer

  // FEATuRE: Manual parsing
  // Remove as manual picer is much better in Logseq 0.11.*
  // manualParsing()
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
