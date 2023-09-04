import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import { ParsedResult } from "chrono-node";
import { getDateForPage, getScheduledDeadlineDateDay } from "logseq-dateutils";
import * as chrono from "chrono-node";

const checkIfUrl = (str: string): boolean => {
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

const checkIfScheduledDeadlineHasTime = (
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

const inlineParsing = async (
  currBlock: BlockEntity,
): Promise<string | void> => {
  let { content } = currBlock;
  //@ts-ignore
  const chronoBlock: ParsedResult[] = chrono[logseq.settings!.lang].parse(
    content,
    new Date(),
    {
      forwardDate: true,
    },
  );

  if (!chronoBlock || !chronoBlock[0]) {
    return;
  }

  const parsedText = chronoBlock[0].text;
  const parsedStart = chronoBlock[0].start.date();
  const parsedEnd = chronoBlock[0].end?.date();

  switch (true) {
    case content.includes("@from"): {
      content = content.replace("@from", "").replace(parsedText, "");
      content = `${content}
      start-time:: ${parsedStart.toTimeString().substring(0, 5)}
      end-time:: ${parsedEnd.toTimeString().substring(0, 5)}`;
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
      const checkTime = checkIfScheduledDeadlineHasTime(chronoBlock[0].start);
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
