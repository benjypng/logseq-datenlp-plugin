import { getWeek, getYear } from 'date-fns'

import { helpers } from './helpers'
import css from './toolbar.css?raw'

export const handleToolbar = async () => {
  logseq.provideStyle(css)

  logseq.provideModel({
    async previousDay() {
      logseq.App.pushState('page', {
        name: await helpers.previousDayName(),
      })
    },
    async nextDay() {
      logseq.App.pushState('page', {
        name: await helpers.nextDayName(),
      })
    },
    async showWeek() {
      const year = getYear(new Date())
      const week = getWeek(new Date())
      const pageName = `${year}/Week ${week}`

      // Create the page embeds
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

      // Go to page
      logseq.App.pushState('page', {
        name: pageName,
      })
    },
  })

  logseq.App.registerUIItem('toolbar', {
    key: 'datenlp-forward-day',
    template: `<a class="button datenlp-toolbar" data-on-click="nextDay">Next Day</a>`,
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'datenlp-back-day',
    template: `<a class="button datenlp-toolbar" data-on-click="previousDay">Previous Day</a>`,
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'datenlp-week-number',
    template: `<a class="button datenlp-toolbar" data-on-click="showWeek">Week ${getWeek(new Date())}</a>`,
  })
}
