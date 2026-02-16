import './index.css'

import type { ParsedResult } from 'chrono-node'
import * as chrono from 'chrono-node'
import { KeyboardEvent, useRef, useState } from 'react'

export const GotoDate = () => {
  const [searchVal, setSearchVal] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

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
    <div id="gotodate-container" onClick={reset}>
      <div
        id="gotodate-card"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div id="gotodate-input-wrapper">
          <svg
            className="gotodate-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="gotodate-input"
            type="text"
            placeholder="E.g. tomorrow, 4th July, 6 months later"
            onKeyDown={handleSubmit}
            onChange={(e) => setSearchVal(e.target.value)}
            value={searchVal}
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
