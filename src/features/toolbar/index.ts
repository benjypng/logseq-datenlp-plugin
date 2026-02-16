import { getWeek, getYear } from 'date-fns'

import { handleAppendEmbeds } from './handle-append-page-embeds'
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
    async disDay() {
      logseq.App.pushState('page', {
        name: await helpers.disDayName(),
      })
    },
    async showWeek() {
      const year = getYear(new Date())
      const week = getWeek(new Date())
      const pageName = `${year}/Week ${week}`
      await logseq.Editor.createPage(
        pageName,
        {},
        {
          redirect: false,
          createFirstBlock: false,
          journal: false,
        },
      )

      // Create the page embeds
      await handleAppendEmbeds(pageName, year, week)

      // Go to page
      logseq.App.pushState('page', {
        name: pageName,
      })
    },
  })

  logseq.App.registerUIItem('toolbar', {
    key: 'datenlp-day-forward',
    template: `<a class="button datenlp-toolbar" data-on-click="nextDay"><i class="ti ti-chevron-right"></i></a>`,
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'datenlp-day-dis', // have to use slang as logseq sorts the toolbar by name
    template: `<a class="button datenlp-toolbar" data-on-click="disDay">Today</a>`,
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'datenlp-day-back',
    template: `<a class="button datenlp-toolbar" data-on-click="previousDay"><i class="ti ti-chevron-left"></i></a>`,
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'datenlp-week-dis',
    template: `<a class="button datenlp-toolbar" data-on-click="showWeek">Week ${getWeek(new Date())}</a>`,
  })
}
