import {
  Card,
  Input,
  Overlay,
  ThemeProvider,
} from '@benjypng/ls-plugin-design-system'
import '@benjypng/ls-plugin-design-system/styles.css'

import type { ParsedResult } from 'chrono-node'
import * as chrono from 'chrono-node'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'

export const GotoDate = () => {
  const [searchVal, setSearchVal] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    logseq.App.onThemeModeChanged(({ mode }) => {
      setTheme(mode === 'light' ? 'light' : 'dark')
    })
  }, [])

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
    <ThemeProvider theme={theme}>
      <Overlay onClose={reset} blur>
        <Card width={480}>
          <Input
            id="gotodate-input"
            ref={inputRef}
            variant="flush"
            leadingIcon={
              <svg
                width="18"
                height="18"
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
            }
            placeholder="E.g. tomorrow, 4th July, 6 months later"
            onKeyDown={handleSubmit}
            onChange={(e) => setSearchVal(e.target.value)}
            value={searchVal}
            autoFocus
          />
        </Card>
      </Overlay>
    </ThemeProvider>
  )
}
