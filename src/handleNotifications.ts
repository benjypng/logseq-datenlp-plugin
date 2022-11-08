export function snoozeFunction(content: string) {
  const options = {
    body: "Click to snooze or simply close this notification",
    timeoutType: "never",
  };

  const customNotification = new Notification(
    logseq.settings!.useBlockAsAlarmTitle ? content : "Alarm",
    options
  );
  customNotification.onclick = function () {
    window.setTimeout(function () {
      snoozeFunction(content);
    }, logseq.settings!.defaultSnooze * 60000);
  };
}
