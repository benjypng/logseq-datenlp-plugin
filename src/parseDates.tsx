import { getDateForPage, getScheduledDeadlineDateDay } from "logseq-dateutils";
import { inlineParsing } from "./inlineParsing";
import * as chrono from "chrono-node";
import { snoozeFunction } from "./handleNotifications";

export const parseDates = async (
  preferredDateFormat: string,
  parseType: string
) => {
  // Parse block content
  const currBlock = await logseq.Editor.getCurrentBlock();

  let chronoBlock: any[];

  const { lang } = logseq.settings;

  if (
    currBlock.content.includes("SCHEDULED: ") ||
    currBlock.content.includes("DEADLINE: ")
  ) {
    return;
  } else {
    if (
      lang === "fr" ||
      lang === "ja" ||
      lang === "nl" ||
      lang === "en" ||
      lang === "de" ||
      lang === "pt" ||
      lang === "zh"
    ) {
      chronoBlock = chrono[`${lang}`].parse(currBlock.content, new Date(), {
        forwardDate: true,
      });
    } else {
      chronoBlock = chrono["en"].parse(currBlock.content, new Date(), {
        forwardDate: true,
      });
    }
  }

  const startDate = chronoBlock[0].start.date();

  if (startDate === null) {
    logseq.UI.showMsg("There are no dates to parse.");
    return;
  }

  if (parseType === "date") {
    // Create properties
    startDate !== null
      ? await logseq.Editor.upsertBlockProperty(
          currBlock.uuid,
          "date",
          getDateForPage(startDate, preferredDateFormat)
        )
      : "";
  } else if (parseType === "SCHEDULED" || parseType === "DEADLINE") {
    if (parseType === "SCHEDULED" && logseq.settings!.notifications) {
      const reminder = new Date(startDate).getTime() - Date.now();

      window.setTimeout(() => {
        snoozeFunction(currBlock!.content);
      }, reminder);
    }

    startDate !== null
      ? await logseq.Editor.updateBlock(
          currBlock.uuid,
          `${currBlock.content}
${parseType}: <${getScheduledDeadlineDateDay(startDate)}${
            chronoBlock[0].start.knownValues.hour !== undefined
              ? ` ${startDate.toTimeString().substring(0, 5)}`
              : ``
          }>`
        )
      : "";
  } else if (parseType === "inline") {
    if (startDate !== null) {
      const newContent = currBlock.content.replace(
        chronoBlock[0].text,
        getDateForPage(startDate, preferredDateFormat)
      );

      await logseq.Editor.updateBlock(currBlock.uuid, newContent);
    } else {
      return "";
    }
  } else if (parseType === "todo") {
    //     startDate !== null
    //       ? await logseq.Editor.updateBlock(
    //           currBlock.uuid,
    //           `TODO ${eventTitle}
    // SCHEDULED: <${new Date(startDate)
    //             .toLocaleDateString()
    //             .split('/')
    //             .reverse()
    //             .join('-')} A ${
    //             !isAllDay && new Date(startDate).toLocaleTimeString()
    //           }>`
    //         )
    //       : '';
  }

  window.setTimeout(async () => {
    const nextBlock = await logseq.Editor.insertBlock(currBlock.uuid, "", {
      sibling: true,
      before: false,
    });

    await logseq.Editor.editBlock(nextBlock.uuid);
  }, 600);
};

////// INLINE PARSING /////
export const callback = async function (mutationsList: any[]) {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "childList" &&
      mutation.removedNodes.length > 0 &&
      mutation.removedNodes[0].className === "editor-inner block-editor"
    ) {
      //   let uuid = mutation.removedNodes[0].firstElementChild.id
      //     .split('edit-block-')[1]
      //     .substring(2);
      //   // Use recursion to check if intermediate reference number has 1, 2 or 3 characters
      //   const checkUUID = () => {
      //     if (uuid.startsWith('-')) {
      //       uuid = uuid.substring(1);
      //       checkUUID();
      //     }
      //   };
      //   checkUUID();
      const uuid = mutation.target
        .closest('div[id^="ls-block"]')
        ?.getAttribute("blockid");
      const currBlock = await logseq.App.getBlock(uuid);
      // Deprecated in favour of making the change in plugin settings
      //if (currBlock.content.toLowerCase() === '%enable auto-parsing%') {
      //  logseq.updateSettings({ auto: true });
      //  logseq.App.showMsg('Auto parsing ON');
      //}
      //if (currBlock.content.toLowerCase() === '%disable auto-parsing%') {
      //  logseq.updateSettings({ auto: false });
      //  logseq.App.showMsg('Auto parsing OFF');
      //}
      //// If auto parsing is on
      if (logseq.settings.auto) {
        inlineParsing(currBlock, "auto");
      } else if (logseq.settings.semiAuto) {
        inlineParsing(currBlock, "semiAuto");
      }
    }
  }
};
