import '../../output.css'

import * as chrono from 'chrono-node'
import { ParsedResult } from 'chrono-node'
import { getDateForPage } from 'logseq-dateutils'
import { ChangeEvent, KeyboardEvent, useState } from 'react'

export const GotoDate = () => {
  const [searchVal, setSearchVal] = useState('')

  const handleSubmit = async (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return

    const chronoBlock: ParsedResult[] = chrono.parse(searchVal, new Date(), {
      forwardDate: true,
    })

    if (!chronoBlock || chronoBlock.length === 0 || chronoBlock.length > 1) {
      await logseq.UI.showMsg(
        'Unable to parse. Is there a typo or you tried to have two date references (e.g. today and tomorrow)?',
        'error',
      )
      return
    }

    const startingDate = getDateForPage(
      chronoBlock[0]!.start.date(),
      logseq.settings!.preferredDateFormat,
    )
    logseq.App.pushState('page', {
      name: startingDate.substring(2, startingDate.length - 2),
    })
    setSearchVal('')
    logseq.hideMainUI({ restoreEditingCursor: true })
  }

  return (
    <div className="search-container p-3 w-full flex justify-center content-center h-screen">
      <input
        className="search-field rounded-lg w-[70%] h-12 text-gray-700 py-1 px-2 caret-black-800 border-2 border-black m-auto"
        autoFocus
        type="text"
        placeholder="E.g. tomorrow, 4th July, 6 months later"
        name="searchVal"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchVal(e.target.value)
        }
        value={searchVal}
        onKeyDown={(e: KeyboardEvent) => handleSubmit(e)}
      />
    </div>
  )
}
