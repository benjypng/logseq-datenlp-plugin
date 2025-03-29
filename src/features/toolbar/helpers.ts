import { PageEntity } from '@logseq/libs/dist/LSPlugin'
import {
  addDays,
  Day,
  eachDayOfInterval,
  endOfWeek,
  parse,
  setWeek,
  startOfWeek,
  subDays,
  getWeek,
  getYear,
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

const isWeeklyEntry = (pageName: string) => {
  const [year, week] = pageName.split('/');
  if (!year || isNaN(parseInt(year))) {
    return false;
  }
 
  if (!week || week.indexOf('Week') === -1) {
    return false;
  }
  const weekNumber = parseInt(week.replace('Week ', ''));
  return weekNumber >= 1 && weekNumber <= 53;
}

/**
 * Interesting: why the difference between "name" and "originalName"?
 */
const getJournalWeek = async () => {
  const currPage = await logseq.Editor.getCurrentPage()
  if (!currPage || !isWeeklyEntry(currPage.originalName)) {
    const year = getYear(new Date());
    const week = getWeek(new Date());
    return { year, week };
  }
  const { originalName } = currPage as PageEntity
  const [yearString, weekString] = originalName.toString().split("/");
  const year = parseInt(yearString!);
  const week = parseInt(weekString!.replace("Week ", ""));
  return { year, week };
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
  disDayName: async () => {
    const { preferredDateFormat } = await logseq.App.getUserConfigs()
    return getDateForPageWithoutBrackets(new Date(), preferredDateFormat)
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
  previousWeekName: async () => {
    const parsedJournalWeek = await getJournalWeek();
    if (!parsedJournalWeek) {
      throw new Error('Could not get the previous week');
    }
    const {year, week} = parsedJournalWeek;
    const prevWeek = week - 1 === 0 ? 52 : week - 1;
    const prevYear = week - 1 === 0 ? year - 1 : year;
    return {year: prevYear, week: prevWeek};
  },
  nextWeekName: async () => {
    const parsedJournalWeek = await getJournalWeek();
    if (!parsedJournalWeek) {
      throw new Error('Could not get the next week')
    }
    const {year, week} = parsedJournalWeek;
    const nextWeek = week + 1 === 53 ? 1 : week + 1;
    const nextYear = week + 1 === 53 ? year + 1 : year;
    return {year: nextYear, week: nextWeek};
  }
}
