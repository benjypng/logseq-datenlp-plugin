import { helpers } from './helpers'

export const handleAppendEmbeds = async (
  pageName: string,
  year: number,
  week: number,
) => {
  const pbt = await logseq.Editor.getPageBlocksTree(pageName)
  if (pbt.length === 0 || pbt.length === 1) {
    const dateArr = await helpers.insertDaysInWeek(year, week)
    dateArr.forEach(
      async (date) =>
        await logseq.Editor.appendBlockInPage(
          pageName,
          `{{embed [[${date}]]}}`,
        ),
    )
    await logseq.UI.showMsg(
      'Appended dates for the week as page embeds',
      'success',
    )
  }
}
