import { ParsedResult } from 'chrono-node'
import {
  getDateForPage,
  getDeadlineDateDay,
  getScheduledDateDay,
} from 'logseq-dateutils'

import * as parse from '~/features/parse/index'
import { getPreferredDateFormat } from '~/utils'

export const semiAutoParse = async (
  content: string,
  chronoBlock: ParsedResult[],
  parsedText: string,
  parsedStart: Date,
  parsedEnd: Date | undefined,
): Promise<string> => {
  const dateChar = logseq.settings?.dateChar as string
  const scheduledChar = logseq.settings?.scheduledChar as string
  const deadlineChar = logseq.settings?.deadlineChar as string

  if (!dateChar || !scheduledChar || !deadlineChar) throw new Error()

  if (content.startsWith('```') || content.endsWith('```')) return content

  switch (true) {
    case content.includes('@from'): {
      content = content.replace('@from', '').replace(parsedText, '')
      content = `${content}
      start-time:: ${parsedStart.toTimeString().substring(0, 5)}
      end-time:: ${parsedEnd?.toTimeString().substring(0, 5)}`
      return content
    }
    case content.includes(dateChar): {
      if (content.includes(`\`${dateChar}${parsedText}\``)) return content
      const checkTime = parse.checkIfChronoObjHasTime(chronoBlock[0]!.start)
      content = content.replace(
        `${dateChar}${parsedText}`,
        `${getDateForPage(
          parsedStart,
          await getPreferredDateFormat(),
        )}${checkTime}`,
      )
      return content
    }
    case content.includes(scheduledChar) || content.includes(deadlineChar): {
      if (
        content.includes(`\`${scheduledChar}${parsedText}\``) ||
        content.includes(`\`${deadlineChar}${parsedText}\``)
      ) {
        return content
      }

      if (scheduledChar === 'NA' && deadlineChar === 'NA') {
        return content
      }

      const scheduledOrDeadline = content.includes(scheduledChar)
        ? 'SCHEDULED'
        : 'DEADLINE'
      content = content.replace(`${scheduledChar}${parsedText}`, '')
      content = content.replace(`${deadlineChar}${parsedText}`, '')

      if (logseq.settings?.removeTime)
        parsedStart = new Date(parsedStart.setHours(0, 0, 0, 0))

      if (scheduledOrDeadline === 'SCHEDULED') {
        content = `${content}
${getScheduledDateDay(parsedStart)}`
      } else {
        content = `${content}
${getDeadlineDateDay(parsedStart)}`
      }
      return content
    }
    default: {
      return ''
    }
  }
}

export const startInlineParsing = () => {
  logseq.DB.onChanged(async ({ blocks, txMeta }) => {
    if (!txMeta || !txMeta.outlinerOp || !blocks[0]) return

    switch (txMeta.outlinerOp) {
      case 'save-block': {
        break
      }

      case 'insert-blocks': {
        const currBlkUuid = await logseq.Editor.checkEditing()
        if (!currBlkUuid) return

        const prevSiblingBlk = await logseq.Editor.getPreviousSiblingBlock(
          currBlkUuid as string,
        )
        if (!prevSiblingBlk) return

        const newContent = await parse.inlineParsing(prevSiblingBlk)
        if (newContent) {
          await logseq.Editor.updateBlock(prevSiblingBlk.uuid, newContent)
        }
        break
      }
    }
  })
}
