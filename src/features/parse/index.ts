import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import * as chrono from "chrono-node";
import { ParsedResult } from "chrono-node/dist/cjs";

import { manualParse } from "~/features/parse/manual";
import { semiAutoParse } from "~/features/parse/semi-auto";

export const checkIfUrl = (str: string): boolean => {
  switch (true) {
    case str.includes("http"):
      return true;
    case str.includes("://"):
      return true;
    case str.includes("www"):
      return true;
    default:
      return false;
  }
};

export const checkIfChronoObjHasTime = (
  startObj: Partial<ParsedResult>,
): string => {
  // @ts-ignore
  if (startObj.knownValues.hour) {
    // @ts-ignore
    return ` ${startObj.date().toTimeString().substring(0, 5)}`;
  } else {
    return "";
  }
};

const handleMultipleParsedText = (
  chronoBlock: ParsedResult[],
  content: string,
  options?: { flag: string },
): string => {
  let parsedStr = "";
  for (let i = 0; i < chronoBlock.length; i++) {
    const parsedText = chronoBlock[i]!.text;
    const parsedStart = chronoBlock[i]!.start.date();
    const parsedEnd = chronoBlock[i]!.end?.date();
    if (i === 0) {
      if (!options?.flag) {
        const str = semiAutoParse(
          content,
          chronoBlock,
          parsedText,
          parsedStart,
          parsedEnd,
        );
        if (str !== "") parsedStr = str;
      } else {
        const str = manualParse(
          options.flag,
          content,
          chronoBlock,
          parsedText,
          parsedStart,
        );
        if (str) parsedStr = str;
      }
    }
    if (i > 0) {
      if (logseq.settings!.insertDateProperty) break;
      if (!options?.flag) {
        parsedStr = semiAutoParse(
          parsedStr,
          chronoBlock,
          parsedText,
          parsedStart,
          parsedEnd,
        );
      } else {
        parsedStr = manualParse(
          options.flag,
          parsedStr,
          chronoBlock,
          parsedText,
          parsedStart,
        );
      }
    }
  }
  return parsedStr;
};

export const inlineParsing = async (
  currBlock: BlockEntity,
  options?: { flag: string },
): Promise<string | undefined> => {
  const { content } = currBlock;
  //@ts-ignore
  const chronoBlock: ParsedResult[] = chrono[logseq.settings!.lang].parse(
    content,
    new Date(),
  );
  if (!chronoBlock || !chronoBlock[0]) return "";

  if (chronoBlock.length === 1) {
    const parsedText = chronoBlock[0].text;
    const parsedStart = chronoBlock[0].start.date();
    const parsedEnd = chronoBlock[0].end?.date();

    if (!options?.flag) {
      return semiAutoParse(
        content,
        chronoBlock,
        parsedText,
        parsedStart,
        parsedEnd,
      );
    } else {
      return manualParse(
        options.flag,
        content,
        chronoBlock,
        parsedText,
        parsedStart,
      );
    }
  } else {
    if (!options?.flag) {
      return handleMultipleParsedText(chronoBlock, content, options);
    } else {
      return handleMultipleParsedText(chronoBlock, content, options);
    }
  }
};
