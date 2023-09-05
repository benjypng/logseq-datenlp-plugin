import {
  checkIfScheduledDeadlineHasTime,
  checkIfUrl,
  inlineParsing,
} from "~/features/parse/index";
import { getDateForPage, getScheduledDeadlineDateDay } from "logseq-dateutils";
import { ParsedResult } from "chrono-node";

export const semiAutoParse = (
  content: string,
  chronoBlock: ParsedResult[],
  parsedText: string,
  parsedStart: Date,
  parsedEnd: Date | undefined,
): string => {
  if (content.startsWith("`") && content.endsWith("`")) return "";
  switch (true) {
    case content.includes("@from"): {
      content = content.replace("@from", "").replace(parsedText, "");
      content = `${content}
      start-time:: ${parsedStart.toTimeString().substring(0, 5)}
      end-time:: ${parsedEnd?.toTimeString().substring(0, 5)}`;
      return content;
    }
    case content.includes("@"): {
      content = content.replace(
        `@${parsedText}`,
        getDateForPage(parsedStart, logseq.settings!.preferredDateFormat),
      );
      return content;
    }
    case content.includes("%") || content.includes("^"): {
      if (checkIfUrl(content)) return ""; // Don't parse URLs
      const checkTime = checkIfScheduledDeadlineHasTime(chronoBlock[0]!.start);
      const scheduledOrDeadline = content.includes("%")
        ? "SCHEDULED"
        : "DEADLINE";
      content = content.replace(`%${parsedText}`, "");
      content = content.replace(`^${parsedText}`, "");
      content = `${content}
      ${scheduledOrDeadline}: <${getScheduledDeadlineDateDay(
        parsedStart,
      )}${checkTime}>`;
      return content;
    }
    default: {
      throw new Error("Nothing to parse");
    }
  }
};

const callback = async (mutationsList: MutationRecord[]): Promise<void> => {
  for (const m of mutationsList) {
    if (
      m.type === "childList" &&
      m.removedNodes.length > 0 &&
      (m.removedNodes[0]! as HTMLElement).className ===
        "editor-inner block-editor"
    ) {
      const uuid = (m.target as HTMLElement)
        .closest('div[id^="ls-block"]')
        ?.getAttribute("blockid") as string;
      const currBlock = await logseq.Editor.getBlock(uuid);
      if (!currBlock) return;

      // Execute inline parsing
      const content = await inlineParsing(currBlock);
      if (content) await logseq.Editor.updateBlock(uuid, content);
    }
  }
};

export const parseMutationObserver = (): void => {
  //@ts-expect-error
  const observer = new top!.MutationObserver(callback);
  observer.observe(top?.document.getElementById("app-container"), {
    attributes: false,
    childList: true,
    subtree: true,
  });
};
