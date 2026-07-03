import { getWeek, getYear } from 'date-fns'

import { handleAppendEmbeds } from './handle-append-page-embeds'
import { getCurrentPageDate, helpers } from './helpers'
import css from './toolbar.css?raw'

const registerWeekButton = async () => {
  const d = await getCurrentPageDate()
  logseq.App.registerUIItem('toolbar', {
    key: 'datenlp-week-dis',
    template: `<a class="button datenlp-toolbar" data-on-click="showWeek">Week ${getWeek(d)}</a>`,
  })
}

export const handleToolbar = async () => {
  const d = await getCurrentPageDate()
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
      const d = await getCurrentPageDate()
      const year = getYear(d)
      const week = getWeek(d)
      const pageName = `${year}/Week ${week}`

      await logseq.Editor.createPage(
        pageName,
        {},
        { redirect: false, createFirstBlock: false, journal: false },
      )

      await handleAppendEmbeds(pageName, year, week)
      logseq.App.pushState('page', { name: pageName })
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
  await registerWeekButton()

  // 2) refresh sur navigation (debounced)
  let t: any = null
  logseq.App.onRouteChanged(() => {
    if (t) clearTimeout(t)
    t = setTimeout(() => {
      registerWeekButton().catch(console.error)
    }, 100)
  })
}
