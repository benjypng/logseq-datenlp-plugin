import { PageEntity } from '@logseq/libs/dist/LSPlugin'
import {
  addDays,
  Day,
  eachDayOfInterval,
  endOfWeek,
  format,
  parse,
  setWeek,
  startOfWeek,
  subDays,
} from 'date-fns'
import { getDateForPageWithoutBrackets } from 'logseq-dateutils'

type StartDayOfWeek = 'Monday' | 'Saturday' | 'Sunday'

const startOfWeekMap: Record<StartDayOfWeek, Day> = {
  Monday: 1,
  Sunday: 0,
  Saturday: 6,
}

const getJournalDay = async () => {
  const currPage = await logseq.Editor.getCurrentPage()
  console.log(currPage)
  if (!currPage || !currPage['journal?']) {
    return new Date()
  }

  const { journalDay } = currPage as PageEntity
  if (!journalDay)
    throw new Error(
      'Something is wrong. This page is supposed to be a journal page.',
    )

  const parsedJournalDay = parse(journalDay.toString(), 'yyyyMMdd', new Date())
  return parsedJournalDay
}

export const helpers = {
  previousDayName: async () => {
    const parsedJournalDay = await getJournalDay()
    if (!parsedJournalDay) return

    const previousDay = subDays(parsedJournalDay, 1)
    const { preferredDateFormat } = await logseq.App.getUserConfigs()
    return getDateForPageWithoutBrackets(previousDay, preferredDateFormat)
  },
  nextDayName: async () => {
    const parsedJournalDay = await getJournalDay()
    if (!parsedJournalDay) return

    const nextDay = addDays(parsedJournalDay, 1)
    const { preferredDateFormat } = await logseq.App.getUserConfigs()
    return getDateForPageWithoutBrackets(nextDay, preferredDateFormat)
  },
  insertDaysInWeek: async (year: number, weekNumber: number) => {
    const dateInWeek = setWeek(new Date(year, 0, 1), weekNumber)
    const startDay = logseq.settings!.startOfWeek as StartDayOfWeek
    const weekStartsOn = startOfWeekMap[startDay]
    const startDate = startOfWeek(dateInWeek, { weekStartsOn })
    const endDate = endOfWeek(dateInWeek, { weekStartsOn })
    const dates = eachDayOfInterval({ start: startDate, end: endDate })
    const { preferredDateFormat } = await logseq.App.getUserConfigs()

    return dates.map((date) =>
      getDateForPageWithoutBrackets(date, preferredDateFormat),
    )
  },
}
