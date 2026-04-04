import { format } from 'date-fns'

export const insertNow = () => {
  logseq.Editor.registerSlashCommand('Now', async (e) => {
    const now = format(new Date(), 'HH:mm')
    await logseq.Editor.updateBlock(e.uuid, `**${now}** `)
  })
}
