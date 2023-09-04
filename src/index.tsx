import "@logseq/libs";
import { settings } from "~/settings";
import { goToDate } from "~/features/go-to-date";
import { completeTask } from "~/features/complete-task";
import { handlePopup } from "~/utils";
import { parseMutationObserver } from "~/features/parse/semi-auto";
import { manualParsing } from "~/features/parse/manual";

const main = () => {
  console.info("logseq-datenlp-plugin loaded");
  handlePopup();

  window.setTimeout(async () => {
    //Save user configs in settings;
    const preferredDateFormat: string = (await logseq.App.getUserConfigs())
      .preferredDateFormat;
    logseq.updateSettings({ preferredDateFormat: preferredDateFormat });
    console.info(
      `logseq-datenlp-plugin: Settings updated to ${preferredDateFormat}`,
    );
  }, 1500);

  goToDate();
  completeTask();
  if (logseq.settings!.semiAuto) parseMutationObserver(); // enable mutation observer
  manualParsing();
};

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
