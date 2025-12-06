import { getDateForPage } from 'logseq-dateutils'

import { getPreferredDateFormat } from '~/utils'

export const completeTask = (): void => {
  logseq.App.registerCommandPalette(
    {
      key: 'logseq-datenlp-plugin-completetask',
      label: '@Complete task',
      keybinding: {
        binding: logseq.settings!.completeTaskShortcut as string,
      },
    },

    async () => {
      const currBlk = await logseq.Editor.getCurrentBlock()
      if (!currBlk) return

      const markerArr: string[] = ['TODO', 'NOW', 'WAITING', 'DOING', 'LATER']
      // Handle if task is already done, undo it. If task is not done, then
      // mark it as done.
      let { content } = currBlk
      if (!content) return
      const date = getDateForPage(new Date(), await getPreferredDateFormat())

      if (currBlk.marker === 'DONE') {
        content = content.replace(`[[${date}}]]`, '')
        content = content.replace('DONE', 'TODO')
        await logseq.Editor.updateBlock(currBlk.uuid, content)
        await logseq.Editor.exitEditingMode()
      } else {
        // Add date
        // Replace TODO
        // Remove Scheduled and Deadline
        content = `${content} ${date}`
        for (const m of markerArr) {
          // Replace TODO
          content = content.replace(m, 'DONE')
        }
        if (
          content.includes('SCHEDULED: <') ||
          content.includes('DEADLINE: <' + ' <')
        ) {
          content = content.substring(0, content.indexOf('SCHEDULED: <'))
          content = content.substring(0, content.indexOf('DEADLINE: <'))
        }
        await logseq.Editor.updateBlock(currBlk.uuid, content)
        await logseq.Editor.exitEditingMode()
      }
    },
  )
}
