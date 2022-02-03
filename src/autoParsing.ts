import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import { getDateForPage } from 'logseq-dateutils';

export const autoParsing = (currBlock: BlockEntity, chronoBlock: any[]) => {
  const chronoDate = chronoBlock[0].start.date();

  const startingDate = getDateForPage(
    chronoDate,
    logseq.settings.preferredDateFormat
  );

  return currBlock.content.replace(chronoBlock[0].text, startingDate);
};
