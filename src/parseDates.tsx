import chrono from 'chrono-node';
import { getDateForPage, getDayInText } from './dateUtils';

export const parseDates = async (
  preferredDateFormat: string,
  parseType: string
) => {
  // Parse block content
  const currBlock = await logseq.Editor.getCurrentBlock();

  let chronoBlock: any[];

  const { lang } = logseq.settings;
  if (lang === 'fr' || lang === 'ja' || lang === 'nl' || lang === 'en') {
    chronoBlock = chrono[`${lang}`].parse(currBlock.content);
  } else {
    logseq.App.showMsg(
      'Please double check your language in the plugin settings.'
    );
  }

  const startDate = chronoBlock[0].start.date();

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
  } else if (parseType === 'SCHEDULED' || parseType === 'DEADLINE') {
    startDate !== null
      ? await logseq.Editor.updateBlock(
          currBlock.uuid,
          `${currBlock.content}
${parseType}: <${new Date(startDate)
            .toLocaleDateString()
            .split('/')
            .reverse()
            .join('-')} ${getDayInText(new Date(startDate))}${
            chronoBlock[0].end !== undefined
              ? ` ${startDate.toLocaleTimeString()}`
              : ''
          }>`
        )
      : '';
  } else if ((parseType = 'todo')) {
    //     startDate !== null
    //       ? await logseq.Editor.updateBlock(
    //           currBlock.uuid,
    //           `TODO ${eventTitle}
    // SCHEDULED: <${new Date(startDate)
    //             .toLocaleDateString()
    //             .split('/')
    //             .reverse()
    //             .join('-')} A ${
    //             !isAllDay && new Date(startDate).toLocaleTimeString()
    //           }>`
    //         )
    //       : '';
  }

  window.setTimeout(async () => {
    const nextBlock = await logseq.Editor.insertBlock(currBlock.uuid, '', {
      sibling: true,
      before: false,
    });

    await logseq.Editor.editBlock(nextBlock.uuid);
  }, 600);
};

////// INLINE PARSING /////
export const callback = async function (mutationsList: any[]) {
  const userConfigs = await logseq.App.getUserConfigs();
  const preferredDateFormat: string = userConfigs.preferredDateFormat;

  for (const mutation of mutationsList) {
    if (
      mutation.type === 'childList' &&
      mutation.removedNodes.length > 0 &&
      mutation.removedNodes[0].className === 'editor-inner block-editor'
    ) {
      //   let uuid = mutation.removedNodes[0].firstElementChild.id
      //     .split('edit-block-')[1]
      //     .substring(2);

      //   // Use recursion to check if intermediate reference number has 1, 2 or 3 characters
      //   const checkUUID = () => {
      //     if (uuid.startsWith('-')) {
      //       uuid = uuid.substring(1);
      //       checkUUID();
      //     }
      //   };
      //   checkUUID();

      const uuid = mutation.target
        .closest('div[id^="ls-block"]')
        ?.getAttribute('blockid');

      console.log(uuid);

      const currBlock = await logseq.App.getBlock(uuid);

      if (currBlock.content.toLowerCase() === '%enable auto-parsing%') {
        logseq.updateSettings({ auto: true });
        logseq.App.showMsg('Auto parsing ON');
      }

      if (currBlock.content.toLowerCase() === '%disable auto-parsing%') {
        logseq.updateSettings({ auto: false });
        logseq.App.showMsg('Auto parsing OFF');
      }

      if (logseq.settings.auto) {
        let chronoBlock: any[];
        if (logseq.settings.lang) {
          chronoBlock = chrono[`${logseq.settings.lang}`].parse(
            currBlock.content
          );
        } else {
          chronoBlock = chrono.parse(currBlock.content);
        }

        if (chronoBlock.length > 0) {
          const startingDate = getDateForPage(
            chronoBlock[0].start.date(),
            preferredDateFormat
          );

          if (!currBlock.content.includes(startingDate)) {
            const newContent = currBlock.content.replace(
              chronoBlock[0].text,
              startingDate
            );

            await logseq.Editor.updateBlock(currBlock.uuid, newContent);
          }
        }
      }
    }
  }
};
