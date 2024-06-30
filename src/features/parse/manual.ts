import { ParsedResult } from 'chrono-node/dist/cjs'
import {
  getDateForPage,
  getDeadlineDateDay,
  getScheduledDateDay,
} from 'logseq-dateutils'

import {
  checkIfChronoObjHasTime,
  checkIfUrl,
  inlineParsing,
} from '~/features/parse/index'
import { getPreferredDateFormat } from '~/utils'

export const manualParse = async (
  flag: string,
  content: string,
  chronoBlock: ParsedResult[],
  parsedText: string,
  parsedStart: Date,
): Promise<string> => {
  switch (flag) {
    case 'manual-date': {
      if (!logseq.settings!.insertDateProperty) {
        const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start)
        content = content.replace(
          parsedText,
          `${getDateForPage(
            parsedStart,
            await getPreferredDateFormat(),
          )}${checkTime}`,
        )
        return content
      } else {
        content = content.replace(parsedText, '')
        content = `${content}
date:: ${getDateForPage(parsedStart, await getPreferredDateFormat())}`
        return content
      }
    }
    case 'manual-scheduled': {
      if (checkIfUrl(content)) return '' // Don't parse URLs
      const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start)
      content = content.replace(parsedText, '')
      content = `${content}
${getScheduledDateDay(parsedStart)}${checkTime}`
      return content
    }
    case 'manual-deadline': {
      if (checkIfUrl(content)) return '' // Don't parse URLs
      const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start)
      content = content.replace(parsedText, '')
      content = `${content}
${getDeadlineDateDay(parsedStart)}${checkTime}`
      return content
    }
    default: {
      throw new Error('Nothing to parse')
    }
  }
}

export const manualParsing = () => {
  logseq.Editor.registerSlashCommand(
    'Parse dates',
    async (e: { uuid: string }) => {
      const blk = await logseq.Editor.getBlock(e.uuid)
      if (!blk) return
      const content = await inlineParsing(blk, { flag: 'manual-date' })
      if (content) await logseq.Editor.updateBlock(e.uuid, content)
    },
  )

  logseq.Editor.registerSlashCommand(
    'Parse scheduled',
    async (e: { uuid: string }) => {
      const blk = await logseq.Editor.getBlock(e.uuid)
      if (!blk) return
      const content = await inlineParsing(blk, { flag: 'manual-scheduled' })
      if (content) await logseq.Editor.updateBlock(e.uuid, content)
    },
  )

  logseq.Editor.registerSlashCommand(
    'Parse deadline',
    async (e: { uuid: string }) => {
      const blk = await logseq.Editor.getBlock(e.uuid)
      if (!blk) return
      const content = await inlineParsing(blk, { flag: 'manual-deadline' })
      if (content) await logseq.Editor.updateBlock(e.uuid, content)
    },
  )
}
