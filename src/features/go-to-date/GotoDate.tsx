import './index.css'

import type { ParsedResult } from 'chrono-node'
import * as chrono from 'chrono-node'
import { KeyboardEvent, useState } from 'react'

export const GotoDate = () => {
  const [searchVal, setSearchVal] = useState('')

  const reset = () => {
    setSearchVal('')
    logseq.hideMainUI({ restoreEditingCursor: true })
  }

  const handleSubmit = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    const trimmed = searchVal.trim()

    const chronoResult: ParsedResult[] = chrono.parse(trimmed, new Date(), {
      forwardDate: true,
    })
    if (!chronoResult || chronoResult.length !== 1 || !chronoResult[0]) {
      await logseq.UI.showMsg(
        'Unable to parse the date. Please enter a single valid date expression.',
        'error',
      )
      return
    }

    const date = chronoResult[0].start.date()

    const journalPage = await logseq.Editor.createJournalPage(date)

    if (!journalPage) {
      await logseq.UI.showMsg('Unable to create journal page', 'error')
      return
    }

    logseq.App.pushState('page', {
      name: journalPage.name,
    })

    reset()
  }

  return (
    <div id="gotodate-field-container">
      <input
        id="gotodate-field"
        type="text"
        placeholder="E.g. tomorrow, 4th July, 6 months later"
        name="searchVal"
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        onKeyDown={handleSubmit}
      />
    </div>
  )
}
