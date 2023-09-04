export const handlePopup = () => {
  //ESC
  document.addEventListener(
    "keydown",
    (e: EventListener | Event) => {
      if (e.key === "Escape") {
        logseq.hideMainUI({ restoreEditingCursor: true });
      }
      e.stopPropagation();
    },
    false,
  );
};
