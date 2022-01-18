import '@logseq/libs';
import Sherlock from 'sherlockjs';

const getOrdinalNum = (n: number) => {
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
};

const getDateForPage = (d: Date, preferredDateFormat: string) => {
  const getYear = d.getFullYear();
  const getMonth = d.toString().substring(4, 7);
  const getMonthNumber = d.getMonth() + 1;
  const getDate = d.getDate();

  if (preferredDateFormat === 'MMM do yyyy') {
    return `[[${getMonth} ${getOrdinalNum(getDate)}, ${getYear}]]`;
  } else if (
    preferredDateFormat.includes('yyyy') &&
    preferredDateFormat.includes('MM') &&
    preferredDateFormat.includes('dd') &&
    ('-' || '_' || '/')
  ) {
    var mapObj = {
      yyyy: getYear,
      dd: ('0' + getDate).slice(-2),
      MM: ('0' + getMonthNumber).slice(-2),
    };
    let dateStr = preferredDateFormat;
    dateStr = dateStr.replace(/yyyy|dd|MM/gi, function (matched) {
      return mapObj[matched];
    });
    return `[[${dateStr}]]`;
  } else {
    return `[[${getMonth} ${getOrdinalNum(getDate)}, ${getYear}]]`;
  }
};

const parseDates = async (preferredDateFormat: string, parseType: string) => {
  // Parse block content
  const currBlock = await logseq.Editor.getCurrentBlock();

  const blockContent = await logseq.Editor.getEditingBlockContent();

  const parsedBlock = await Sherlock.parse(blockContent);

  // Destructure
  const { isAllDay, eventTitle, startDate, endDate } = parsedBlock;

  if (startDate === null) {
    logseq.App.showMsg('There are no dates to parse.');
    return;
  }

  if (parseType === 'date') {
    // Create properties
    startDate !== null
      ? await logseq.Editor.upsertBlockProperty(
          currBlock.uuid,
          'date',
          getDateForPage(startDate, preferredDateFormat)
        )
      : '';

    isAllDay !== true
      ? await logseq.Editor.upsertBlockProperty(
          currBlock.uuid,
          'time',
          startDate.toLocaleTimeString()
        )
      : '';
  } else if (parseType === 'SCHEDULED' || parseType === 'DEADLINE') {
    startDate !== null
      ? await logseq.Editor.updateBlock(
          currBlock.uuid,
          `${blockContent}
${parseType}: <${new Date(startDate)
            .toLocaleDateString()
            .split('/')
            .reverse()
            .join('-')} A ${
            !isAllDay && new Date(startDate).toLocaleTimeString()
          }>`
        )
      : '';
  }

  window.setTimeout(async () => {
    const nextBlock = await logseq.Editor.insertBlock(currBlock.uuid, '', {
      sibling: true,
      before: false,
    });

    await logseq.Editor.editBlock(nextBlock.uuid);
  }, 600);
};

const main = async () => {
  console.log('logseq-datenlp-plugin loaded');

  const userConfigs = await logseq.App.getUserConfigs();
  const preferredDateFormat: string = userConfigs.preferredDateFormat;

  logseq.Editor.registerSlashCommand('parse dates', async () => {
    window.setTimeout(async () => {
      parseDates(preferredDateFormat, 'date');
    }, 600);
  });

  logseq.Editor.registerSlashCommand('parse scheduled', async () => {
    window.setTimeout(async () => {
      parseDates(preferredDateFormat, 'SCHEDULED');
    }, 600);
  });

  logseq.Editor.registerSlashCommand('parse deadline', async () => {
    window.setTimeout(async () => {
      parseDates(preferredDateFormat, 'DEADLINE');
    }, 600);
  });
};

logseq.ready(main).catch(console.error);
