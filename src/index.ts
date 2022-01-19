import '@logseq/libs';
import { parseDates, callback } from './parseDates';

const main = async () => {
  console.log('logseq-datenlp-plugin loaded');

  const userConfigs = await logseq.App.getUserConfigs();
  const preferredDateFormat: string = userConfigs.preferredDateFormat;

  //@ts-expect-error
  const observer = new top.MutationObserver(callback);
  observer.observe(top.document.getElementById('main-content-container'), {
    attributes: false,
    childList: true,
    subtree: true,
  });

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
