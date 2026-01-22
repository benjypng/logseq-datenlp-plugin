import { PageEntity } from "@logseq/libs/dist/LSPlugin";
import {
  addDays,
  Day,
  eachDayOfInterval,
  endOfWeek,
  parse,
  setWeek,
  startOfWeek,
  subDays,
} from "date-fns";
import { getDateForPageWithoutBrackets } from "logseq-dateutils";

type StartDayOfWeek = "Monday" | "Saturday" | "Sunday";

const startOfWeekMap: Record<StartDayOfWeek, Day> = {
  Monday: 1,
  Sunday: 0,
  Saturday: 6,
};

export const helpers = {
  previousDayName: async () => {
    const currPage = await logseq.Editor.getCurrentPage();
    const currPageDate = currPage
      ? parse(
          (currPage?.journalDay as number).toString(),
          "yyyyMMdd",
          new Date(),
        )
      : new Date();

    const previousDay = subDays(currPageDate, 1);
    const { preferredDateFormat } = await logseq.App.getUserConfigs();
    const pageName = getDateForPageWithoutBrackets(
      previousDay,
      preferredDateFormat,
    );

    const findPage = await logseq.Editor.getPage(pageName);
    if (!findPage) {
      await logseq.Editor.createJournalPage(previousDay);
    }

    return pageName;
  },
  nextDayName: async () => {
    const currPage = await logseq.Editor.getCurrentPage();
    const currPageDate = currPage
      ? parse(
          (currPage?.journalDay as number).toString(),
          "yyyyMMdd",
          new Date(),
        )
      : new Date();

    const nextDay = addDays(currPageDate, 1);
    const { preferredDateFormat } = await logseq.App.getUserConfigs();
    const pageName = getDateForPageWithoutBrackets(
      nextDay,
      preferredDateFormat,
    );

    const findPage = await logseq.Editor.getPage(pageName);
    if (!findPage) {
      await logseq.Editor.createJournalPage(nextDay);
    }

    return pageName;
  },
  disDayName: async () => {
    const { preferredDateFormat } = await logseq.App.getUserConfigs();
    return getDateForPageWithoutBrackets(new Date(), preferredDateFormat);
  },
  insertDaysInWeek: async (year: number, weekNumber: number) => {
    const dateInWeek = setWeek(new Date(year, 0, 1), weekNumber);
    const startDay = logseq.settings!.startOfWeek as StartDayOfWeek;
    const weekStartsOn = startOfWeekMap[startDay];
    const startDate = startOfWeek(dateInWeek, { weekStartsOn });
    const endDate = endOfWeek(dateInWeek, { weekStartsOn });
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    const { preferredDateFormat } = await logseq.App.getUserConfigs();

    return dates.map((date) =>
      getDateForPageWithoutBrackets(date, preferredDateFormat),
    );
  },
};
