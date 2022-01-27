import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import chrono from 'chrono-node';
import { getDateForPage } from './dateUtils';

export const inlineParsing = async (
  currBlock: BlockEntity,
  parseType: string
) => {
  // Check for auto parsing
  let chronoBlock: any[];

  // If language settings are set
  if (logseq.settings.lang) {
    chronoBlock = chrono[`${logseq.settings.lang}`].parse(currBlock.content);

    // If language settings are not set
  } else {
    chronoBlock = chrono.parse(currBlock.content);
  }

  // If the content to be parsed has a valid time/date element
  if (chronoBlock.length > 0) {
    // Definte the date in use preferred format
    const chronoDate = chronoBlock[0].start.date();

    const startingDate = getDateForPage(
      chronoDate,
      logseq.settings.preferredDateFormat
    );

    // Check if the content already contains the parsed date, if it doesn't, then parse
    let newContent: string = '';
    if (!currBlock.content.includes(startingDate)) {
      if (parseType === 'semiAuto') {
        newContent = currBlock.content.replace(
          `@${chronoBlock[0].text}`,
          startingDate
        );
      } else if (parseType === 'auto') {
        newContent = currBlock.content.replace(
          chronoBlock[0].text,
          startingDate
        );
      }

      // Account for if the block content contains BOTH @time and date/time to parse
      if (newContent.includes('@time')) {
        const nowTime = chrono
          .parse('now')[0]
          .start.date()
          .toTimeString()
          .substring(0, 5);
        newContent = newContent.replace('@time', nowTime);
      }

      await logseq.Editor.updateBlock(currBlock.uuid, newContent);
    }

    if (
      currBlock.content.includes('@goto') &&
      !currBlock.content.includes(startingDate)
    ) {
      // Command to go to another page
      await logseq.Editor.updateBlock(
        currBlock.uuid,
        currBlock.content.substring(0, currBlock.content.indexOf('@goto'))
      );
      logseq.App.pushState('page', {
        name: startingDate.substring(2, startingDate.length - 2),
      });
    }
  } else {
    // Account for if the block content contains only @time
    if (currBlock.content.includes('@time')) {
      const nowTime = chrono
        .parse('now')[0]
        .start.date()
        .toTimeString()
        .substring(0, 5);
      const newContent = currBlock.content.replace('@time', nowTime);

      await logseq.Editor.updateBlock(currBlock.uuid, newContent);
    }
  }
};
