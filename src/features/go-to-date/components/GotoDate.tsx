import '../../../../output.css'

import * as chrono from 'chrono-node'
import { ParsedResult } from 'chrono-node'
import { getDateForPage } from 'logseq-dateutils'
import React, { KeyboardEvent, useState } from 'react'

export const GotoDate = () => {
  const [searchVal, setSearchVal] = useState('')

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value)
  }

  const handleSubmit = async (e: KeyboardEvent) => {
    if (e.key !== 'Enter') {
      return
    }
    const chronoBlock: ParsedResult[] = chrono.parse(searchVal, new Date(), {
      forwardDate: true,
    })
    if (chronoBlock.length === 0 || !chronoBlock || !chronoBlock[0]) {
      await logseq.UI.showMsg('Error parsing date', 'error')
      return
    } else {
      const startingDate = getDateForPage(
        chronoBlock[0].start.date(),
        logseq.settings!.preferredDateFormat,
      )
      logseq.App.pushState('page', {
        name: startingDate.substring(2, startingDate.length - 2),
      })
      setSearchVal('')
      logseq.hideMainUI({ restoreEditingCursor: true })
    }
  }

  return (
    <div
      className="search-container flex justify-center border border-black"
      tabIndex={-1}
    >
      <div className="absolute top-10 bg-gray-200 rounded-lg p-3 w-96 border">
        <input
          className="search-field appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="E.g. tomorrow, 4th July, 6 months later"
          name="searchVal"
          onChange={handleForm}
          value={searchVal}
          onKeyDown={(e: KeyboardEvent) => handleSubmit(e)}
        />
      </div>
    </div>
  )
}
