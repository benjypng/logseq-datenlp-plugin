import { createRoot } from "react-dom/client";
import { GotoDate } from "~/features/go-to-date/components/GotoDate";

export const goToDate = (): void => {
  logseq.App.registerCommandPalette(
    {
      key: "logseq-datenlp-plugin-gotodate",
      label: "@Goto parsed date using NLP",
      keybinding: { binding: logseq.settings!.gotoDate },
    },
    () => {
      const container = document.getElementById("app");
      const root = createRoot(container!);
      root.render(<GotoDate />);
      createRoot(document.getElementById("app")!).render(<GotoDate />);
      logseq.showMainUI();
      document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key !== "Escape") {
          (document.querySelector(".search-field") as HTMLElement).focus();
        }
      });
    },
  );
};
