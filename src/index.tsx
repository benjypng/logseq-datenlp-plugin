import "@logseq/libs";
import { handleClosePopup } from "./handleClosePopup";
import { settings } from "~/settings";
import { goToDate } from "~/features/go-to-date";
import { completeTask } from "~/features/complete-task";

const main = () => {
  console.info("logseq-datenlp-plugin loaded");
  handleClosePopup();

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

  ///////////// REGISTER SLASH COMMANDS /////////////
  //logseq.Editor.registerSlashCommand("parse dates", async () => {
  //  window.setTimeout(async () => {
  //    parseDates(logseq.settings.preferredDateFormat, "date");
  //  }, 600);
  //});

  //logseq.Editor.registerSlashCommand("parse inline", async () => {
  //  window.setTimeout(async () => {
  //    parseDates(logseq.settings.preferredDateFormat, "inline");
  //  }, 600);
  //});

  //logseq.Editor.registerSlashCommand("parse scheduled", async () => {
  //  window.setTimeout(async () => {
  //    parseDates(logseq.settings.preferredDateFormat, "SCHEDULED");
  //  }, 600);
  //});

  //logseq.Editor.registerSlashCommand("parse deadline", async () => {
  //  window.setTimeout(async () => {
  //    parseDates(logseq.settings.preferredDateFormat, "DEADLINE");
  //  }, 600);
  //});
};

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
