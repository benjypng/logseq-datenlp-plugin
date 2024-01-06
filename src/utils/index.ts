export const handlePopup = () => {
  //ESC
  document.addEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        logseq.hideMainUI({ restoreEditingCursor: true });
      }
      e.stopPropagation();
    },
    false,
  );
};

export const setSettings = async () => {
  if (!logseq.settings) return;
  const { dateChar, scheduledChar, deadlineChar } = logseq.settings;

  // Check if the above has equivalence
  if (
    dateChar === scheduledChar ||
    dateChar === deadlineChar ||
    scheduledChar === deadlineChar
  ) {
    if (dateChar === "NA" || scheduledChar === "NA" || deadlineChar === "NA") {
      return;
    }
    await logseq.UI.showMsg(
      "There are overlapping characters for the inline parsing character. Please re-check your settings",
      "error",
    );
    return;
  }

  window.setTimeout(async () => {
    //Save user configs in settings;
    const preferredDateFormat: string = (await logseq.App.getUserConfigs())
      .preferredDateFormat;
    logseq.updateSettings({ preferredDateFormat: preferredDateFormat });
    console.info(
      `logseq-datenlp-plugin: Settings updated to ${preferredDateFormat}`,
    );
  }, 1500);
};
