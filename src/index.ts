import '@logseq/libs';
import { parseDates, callback } from './parseDates';

const main = async () => {
  console.log('logseq-datenlp-plugin loaded');

  const userConfigs = await logseq.App.getUserConfigs();
  const preferredDateFormat: string = userConfigs.preferredDateFormat;

  if (!logseq.settings.lang) {
    logseq.updateSettings({
      lang: '',
    });
  }

  //@ts-expect-error
  const observer = new top.MutationObserver(callback);
  observer.observe(top.document.getElementById('main-content-container'), {
    attributes: false,
    childList: true,
    subtree: true,
  });

  // register keyboard
  logseq.App.registerCommandPalette(
    {
      key: 'logseq-dailyreflections-plugin',
      label: 'Execute daily reflections',
      keybinding: {
        binding: 'a p',
      },
    },
    () => {
      if (!logseq.settings.auto) {
        logseq.updateSettings({ auto: true });
        logseq.App.showMsg('Auto parsing ON');
      } else {
        logseq.updateSettings({ auto: false });
        logseq.App.showMsg('Auto parsing OFF');
      }
    }
  );

  ///////////// REGISTER SLASH COMMANDS /////////////
  logseq.Editor.registerSlashCommand('parse dates', async () => {
    window.setTimeout(async () => {
      parseDates(preferredDateFormat, 'date');
    }, 600);
  });

  logseq.Editor.registerSlashCommand('parse scheduled', async () => {
    window.setTimeout(async () => {
      parseDates(preferredDateFormat, 'SCHEDULED');
    }, 600);
  });

  logseq.Editor.registerSlashCommand('parse deadline', async () => {
    window.setTimeout(async () => {
      parseDates(preferredDateFormat, 'DEADLINE');
    }, 600);
  });
};

logseq.ready(main).catch(console.error);
