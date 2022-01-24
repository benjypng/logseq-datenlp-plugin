import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { parseDates, callback } from './parseDates';
import { handleClosePopup } from './handleClosePopup';

const main = async () => {
  console.log('logseq-datenlp-plugin loaded');

  const userConfigs = await logseq.App.getUserConfigs();
  const preferredDateFormat: string = userConfigs.preferredDateFormat;

  console.log(preferredDateFormat);

  logseq.updateSettings({ preferredDateFormat: preferredDateFormat });

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
      key: 'logseq-datenlp-plugin-autoparsing',
      label: 'Toggle auto-parsing on/off',
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

  // register command palette
  logseq.App.registerCommandPalette(
    { key: 'logseq-datenlp-plugin-gotodate', label: '@goto parsed date ' },
    () => {
      logseq.showMainUI();

      document.addEventListener('keydown', (e: any) => {
        if (e.keyCode !== 27) {
          (document.querySelector('.search-field') as HTMLElement).focus();
        }
      });
    }
  );

  handleClosePopup();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );

  ///////////// REGISTER SLASH COMMANDS /////////////
  logseq.Editor.registerSlashCommand('parse dates', async () => {
    window.setTimeout(async () => {
      parseDates(logseq.settings.preferredDateFormat, 'date');
    }, 600);
  });

  logseq.Editor.registerSlashCommand('parse scheduled', async () => {
    window.setTimeout(async () => {
      parseDates(logseq.settings.preferredDateFormat, 'SCHEDULED');
    }, 600);
  });

  logseq.Editor.registerSlashCommand('parse deadline', async () => {
    window.setTimeout(async () => {
      parseDates(logseq.settings.preferredDateFormat, 'DEADLINE');
    }, 600);
  });
};

logseq.ready(main).catch(console.error);
