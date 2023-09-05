import { ParsedResult } from "chrono-node/dist/cjs";
import { getDateForPage, getScheduledDeadlineDateDay } from "logseq-dateutils";
import {
  checkIfChronoObjHasTime,
  checkIfUrl,
  inlineParsing,
} from "~/features/parse/index";

export const manualParse = (
  flag: string,
  content: string,
  chronoBlock: ParsedResult[],
  parsedText: string,
  parsedStart: Date,
): string => {
  switch (true) {
    case flag === "@": {
      if (!logseq.settings!.insertDateProperty) {
        const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start);
        content = content.replace(
          parsedText,
          `${getDateForPage(
            parsedStart,
            logseq.settings!.preferredDateFormat,
          )}${checkTime})`,
        );
        return content;
      } else {
        content = content.replace(parsedText, "");
        content = `${content}
        date:: ${getDateForPage(
          parsedStart,
          logseq.settings!.preferredDateFormat,
        )}`;
        return content;
      }
    }
    case flag === "%": {
      if (checkIfUrl(content)) return ""; // Don't parse URLs
      const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start);
      content = content.replace(parsedText, "");
      content = `${content}
      SCHEDULED: <${getScheduledDeadlineDateDay(parsedStart)}${checkTime}>`;
      return content;
    }
    case flag === "^": {
      if (checkIfUrl(content)) return ""; // Don't parse URLs
      const checkTime = checkIfChronoObjHasTime(chronoBlock[0]!.start);
      content = content.replace(parsedText, "");
      content = `${content}
      DEADLINE: <${getScheduledDeadlineDateDay(parsedStart)}${checkTime}>`;
      return content;
    }
    default: {
      throw new Error("Nothing to parse");
    }
  }
};

export const manualParsing = () => {
  // TODO: Refactor inline parsing and extract out the parsing to be used here
  logseq.Editor.registerSlashCommand("Parse dates", async (e) => {
    const blk = await logseq.Editor.getBlock(e.uuid);
    if (!blk) return;
    const content = await inlineParsing(blk, { flag: "@" });
    console.log(content);
    if (content) await logseq.Editor.updateBlock(e.uuid, content);
  });

  logseq.Editor.registerSlashCommand("Parse inline", async (e) => {
    // What to do here?
  });

  logseq.Editor.registerSlashCommand("Parse scheduled", async (e) => {
    // What to do here?
  });

  logseq.Editor.registerSlashCommand("Parse deadline", async (e) => {
    // What to do here?
  });
};
