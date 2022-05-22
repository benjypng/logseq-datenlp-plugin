import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export const semiAutoParsing = (currBlock: BlockEntity, chronoBlock: any[]) => {
  const { content } = currBlock;
  let parsedText: string = chronoBlock[0].text;
  let parsedStartObject: any;
  let parsedEndObject: any;

  if (content.includes("@from")) {
    parsedText = chronoBlock[0].text;
    parsedStartObject = chronoBlock[0].start;
    parsedEndObject = chronoBlock[0].end;
    return { parsedText, parsedStartObject, parsedEndObject };
  } else {
    const specialChars = ["@", "%", "^"];

    for (const c of specialChars) {
      for (const i of chronoBlock) {
        if (content.includes(`${c}${i.text}`)) {
          parsedText = i.text;
          parsedStartObject = i.start;
          parsedEndObject = null;

          return { parsedText, parsedStartObject, parsedEndObject };
        } else {
          continue;
        }
      }
    }
    return { parsedText: null, parsedStartObject: null, parsedEndObject: null };
  }
};
