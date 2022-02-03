import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import chrono from 'chrono-node';
import { getDateForPage, getScheduledDeadlineDateDay } from 'logseq-dateutils';
import { autoParsing } from './autoParsing';
import { semiAutoParsing } from './semiAutoParsing';

export const inlineParsing = async (
  currBlock: BlockEntity,
  parseType: string
) => {
  const { content } = currBlock;

  // Check for auto parsing
  let chronoBlock: any[];

  // If language settings are set
  if (logseq.settings.lang) {
    chronoBlock = chrono[`${logseq.settings.lang}`].parse(
      currBlock.content,
      '',
      { forwardDate: true }
    );

    // If language settings are not set
  } else {
    chronoBlock = chrono.parse(currBlock.content, '', { forwardDate: true });
  }

  // If the content to be parsed has a valid time/date element
  if (chronoBlock.length > 0) {
    let newContent: string = '';

    if (parseType === 'semiAuto') {
      const { parsedText, parsedStartObject } = semiAutoParsing(
        currBlock,
        chronoBlock
      );

      if (parsedText === null || parsedStartObject === null) return;

      const parsedDate = parsedStartObject.date();

      if (content.includes(`@${parsedText}`)) {
        newContent = content.replace(
          `@${parsedText}`,
          getDateForPage(parsedDate, logseq.settings.preferredDateFormat)
        );
      } else if (content.includes(`%${parsedText}`)) {
        newContent = content.replace(
          content,
          `${content.replace(`%${parsedText}`, '')}
SCHEDULED: <${getScheduledDeadlineDateDay(parsedDate)}${
            parsedStartObject.knownValues.hour !== undefined
              ? ` ${parsedDate.toTimeString().substring(0, 5)}`
              : ``
          }>`
        );
      } else if (content.includes(`^${parsedText}`)) {
        newContent = content.replace(
          content,
          `${content.replace(`^${parsedText}`, '')}
DEADLINE: <${getScheduledDeadlineDateDay(parsedDate)}${
            parsedStartObject.knownValues.hour !== undefined
              ? ` ${parsedDate.toTimeString().substring(0, 5)}`
              : ``
          }>`
        );
      }
    } else if (parseType === 'auto') {
      newContent = autoParsing(currBlock, chronoBlock);
    }

    // Account for if the block content contains BOTH @time and date/time to parse
    if (newContent.includes('@time')) {
      const nowTime = chrono
        .parse('now', '', { forwardDate: true })[0]
        .start.date()
        .toTimeString()
        .substring(0, 5);
      newContent = newContent.replace('@time', nowTime);
    }

    // UPDATE BLOCK WITH WHATEVER NEWCONTENT IS DERIVED FROM ABOVE
    await logseq.Editor.updateBlock(currBlock.uuid, newContent);
  }

  // Account for if the block content contains only @time
  if (currBlock.content.includes('@time')) {
    const nowTime = chrono
      .parse('now', '', { forwardDate: true })[0]
      .start.date()
      .toTimeString()
      .substring(0, 5);
    const newContent = currBlock.content.replace('@time', nowTime);

    await logseq.Editor.updateBlock(currBlock.uuid, newContent);
  }
};
