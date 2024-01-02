import "@logseq/libs";
import { settings } from "~/settings";
import { goToDate } from "~/features/go-to-date";
import { completeTask } from "~/features/complete-task";
import { handlePopup, setSettings } from "~/utils";
import { parseMutationObserver } from "~/features/parse/semi-auto";
import { manualParsing } from "~/features/parse/manual";

const main = async () => {
  console.info("logseq-datenlp-plugin loaded");
  setSettings();

  handlePopup();

  logseq.App.onCurrentGraphChanged(async () => {
    setSettings();
  });

  if (logseq.settings!.gotoDate !== "") goToDate();
  completeTask();
  if (logseq.settings!.semiAuto) parseMutationObserver(); // enable mutation observer
  manualParsing();
};

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
