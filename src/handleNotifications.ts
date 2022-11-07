const options = {
  body: "Click to snooze or simply close this notification",
  timeoutType: "never",
};

export function snoozeFunction() {
  const customNotification = new Notification("Alarm", options);
  customNotification.onclick = function () {
    window.setTimeout(function () {
      snoozeFunction();
    }, logseq.settings!.defaultSnooze * 60000);
  };
}
