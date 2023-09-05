import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import { ParsedResult } from "chrono-node/dist/cjs";
import * as chrono from "chrono-node";
import { semiAutoParse } from "~/features/parse/semi-auto";
import { manualParse } from "~/features/parse/manual";

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

export const checkIfScheduledDeadlineHasTime = (
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

export const inlineParsing = async (
  currBlock: BlockEntity,
  options?: { flag: string },
): Promise<string | void> => {
  const { content } = currBlock;
  //@ts-ignore
  const chronoBlock: ParsedResult[] = chrono[logseq.settings!.lang].parse(
    content,
    new Date(),
    {
      forwardDate: true,
    },
  );
  if (!chronoBlock || !chronoBlock[0]) return;

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
};
