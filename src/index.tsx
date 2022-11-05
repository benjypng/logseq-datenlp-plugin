import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { parseDates, callback } from "./parseDates";
import { handleClosePopup } from "./handleClosePopup";
import { getDateForPage } from "logseq-dateutils";
import { callSettings } from "./callSettings";

const main = () => {
  console.log("logseq-datenlp-plugin loaded");

  callSettings();

  window.setTimeout(async () => {
    const userConfigs = await logseq.App.getUserConfigs();
    const preferredDateFormat: string = userConfigs.preferredDateFormat;
    logseq.updateSettings({ preferredDateFormat: preferredDateFormat });
    console.log(`Settings updated to ${preferredDateFormat}`);
  }, 3000);

  //@ts-expect-error
  const observer = new top.MutationObserver(callback);
  observer.observe(top.document.getElementById("app-container"), {
    attributes: false,
    childList: true,
    subtree: true,
  });

  // Below keywords are deprecated in favour of making the change in the plugin settings instead.
  // register keyboard
  //logseq.App.registerCommandPalette(
  //  {
  //    key: "logseq-datenlp-plugin-autoparsing",
  //    label: "Toggle auto-parsing on/off",
  //    keybinding: {
  //      binding: "a p",
  //    },
  //  },
  //  () => {
  //    if (!logseq.settings.auto) {
  //      logseq.updateSettings({ auto: true });
  //      logseq.updateSettings({ semiAuto: false });
  //      logseq.App.showMsg("Auto parsing ON");
  //    } else {
  //      logseq.updateSettings({ auto: false });
  //      logseq.App.showMsg("Auto parsing OFF");
  //    }
  //  }
  //);

  //logseq.App.registerCommandPalette(
  //  {
  //    key: "logseq-datenlp-plugin-semi-autoparsing",
  //    label: "Toggle semi-auto-parsing on/off",
  //    keybinding: {
  //      binding: "s p",
  //    },
  //  },
  //  () => {
  //    if (!logseq.settings.semiAuto) {
  //      logseq.updateSettings({ semiAuto: true });
  //      logseq.updateSettings({ auto: false });
  //      logseq.App.showMsg("Semi auto parsing ON");
  //    } else {
  //      logseq.updateSettings({ semiAuto: false });
  //      logseq.App.showMsg("Semi auto parsing OFF");
  //    }
  //  }
  //);

  // register command palette
  logseq.App.registerCommandPalette(
    { key: "logseq-datenlp-plugin-gotodate", label: "@goto parsed date " },
    () => {
      logseq.showMainUI();

      document.addEventListener("keydown", (e: any) => {
        if (e.keyCode !== 27) {
          (document.querySelector(".search-field") as HTMLElement).focus();
        }
      });
    }
  );

  // add complete task and add date of completion
  logseq.App.registerCommandPalette(
    {
      key: "logseq-datenlp-plugin-completetask",
      label: "@complete task",
      keybinding: {
        binding: "mod+shift+d",
      },
    },
    async () => {
      const currBlk = await logseq.Editor.getCurrentBlock();
      const markerArr = ["TODO", "NOW", "WAITING", "DOING", "LATER"];

      if (!currBlk.content.startsWith("DONE")) {
        let newContent: string = currBlk.content;
        for (let m of markerArr) {
          newContent = newContent.replace(m, "DONE");
        }
        if (
          currBlk.content.includes("SCHEDULED: <") ||
          currBlk.content.includes("DEADLINE: <")
        ) {
          let newContentOne = newContent
            .substring(0, newContent.indexOf("SCHEDULED: <"))
            .trim();

          const newContentTwo = newContent.substring(
            newContent.indexOf("SCHEDULED: <")
          );

          newContentOne =
            newContentOne +
            " " +
            getDateForPage(new Date(), logseq.settings.preferredDateFormat);
          newContent = `${newContentOne}
${newContentTwo}`;
        } else {
          newContent =
            newContent +
            " " +
            getDateForPage(new Date(), logseq.settings.preferredDateFormat);
        }
        await logseq.Editor.updateBlock(currBlk.uuid, newContent);
        await logseq.Editor.exitEditingMode();
      }
    }
  );

  handleClosePopup();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("app")
  );

  ///////////// REGISTER SLASH COMMANDS /////////////
  logseq.Editor.registerSlashCommand("parse dates", async () => {
    window.setTimeout(async () => {
      parseDates(logseq.settings.preferredDateFormat, "date");
    }, 600);
  });

  logseq.Editor.registerSlashCommand("parse inline", async () => {
    window.setTimeout(async () => {
      parseDates(logseq.settings.preferredDateFormat, "inline");
    }, 600);
  });

  logseq.Editor.registerSlashCommand("parse scheduled", async () => {
    window.setTimeout(async () => {
      parseDates(logseq.settings.preferredDateFormat, "SCHEDULED");
    }, 600);
  });

  logseq.Editor.registerSlashCommand("parse deadline", async () => {
    window.setTimeout(async () => {
      parseDates(logseq.settings.preferredDateFormat, "DEADLINE");
    }, 600);
  });
};

logseq.ready(main).catch(console.error);
