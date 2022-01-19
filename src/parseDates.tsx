import Sherlock from 'sherlockjs';
import chrono from 'chrono-node';
import { getDateForPage } from './dateUtils';

export const parseDates = async (
  preferredDateFormat: string,
  parseType: string
) => {
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
      let uuid = mutation.removedNodes[0].firstElementChild.id
        .split('edit-block-')[1]
        .substring(2);

      // Use recursion to check if intermediate reference number has 1, 2 or 3 characters
      const checkUUID = () => {
        if (uuid.startsWith('-')) {
          uuid = uuid.substring(1);
          checkUUID();
        }
      };
      checkUUID();

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
        const chronoBlock = chrono.parse(currBlock.content);

        if (chronoBlock.length > 0) {
          const startingDate = getDateForPage(
            chronoBlock[0].start.date(),
            preferredDateFormat
          );

          const newContent = currBlock.content.replace(
            chronoBlock[0].text,
            startingDate
          );

          await logseq.Editor.updateBlock(currBlock.uuid, newContent);
        }
      }
    }
  }
};
