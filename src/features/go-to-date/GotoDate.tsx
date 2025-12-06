import './index.css'

import type { ParsedResult } from 'chrono-node'
import * as chrono from 'chrono-node'
import { useState } from 'react'

export const GotoDate = () => {
  const [searchVal, setSearchVal] = useState('')

  const reset = () => {
    setSearchVal('')
    logseq.hideMainUI({ restoreEditingCursor: true })
  }

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    const trimmed = searchVal.trim()
    if (!trimmed) return

    const chronoBlock: ParsedResult[] = chrono.parse(trimmed, new Date(), {
      forwardDate: true,
    })

    if (!chronoBlock || chronoBlock.length !== 1) {
      await logseq.UI.showMsg(
        'Unable to parse the date. Please enter a single valid date expression.',
        'error',
      )
      return
    }

    const journalPage = await logseq.Editor.createJournalPage(
      chronoBlock[0]!.start.date(),
    )

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
