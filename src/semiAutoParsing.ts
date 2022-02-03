import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';

export const semiAutoParsing = (currBlock: BlockEntity, chronoBlock: any[]) => {
  const { content } = currBlock;
  let parsedText: string = chronoBlock[0].text;
  let parsedStartObject: any;

  const specialChars = ['@', '%', '^'];

  for (const c of specialChars) {
    for (const i of chronoBlock) {
      if (content.includes(`${c}${i.text}`)) {
        parsedText = i.text;
        parsedStartObject = i.start;

        return { parsedText, parsedStartObject };
      } else {
        continue;
      }
    }
  }
  return { parsedText: null, parsedStartObject: null };
};
