import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin'

export const settings: SettingSchemaDesc[] = [
  {
    key: 'semiAuto',
    type: 'boolean',
    default: true,
    title: 'Semi-auto Parsing',
    description:
      'Enables/disables semi-auto parsing. You can trigger the parsing by using the @ (or another special character set below) symbol, e.g. @tomorrow.',
  },
  {
    key: 'insertDateProperty',
    type: 'boolean',
    default: false,
    title: 'Insert Date Property (not for DB version)',
    description:
      'If set to true, when parsing dates, a date property wil be inserted instead of inline.',
  },
  {
    key: 'lang',
    type: 'enum',
    default: 'en',
    enumChoices: ['en', 'ja', 'fr', 'nl', 'ru', 'de', 'pt', 'zh'],
    enumPicker: 'select',
    title: 'Set language',
    description:
      'Set language of parser. Supports en, ja, fr, nl and ru. (de, pt, and zh are partially supported).',
  },
  {
    key: 'removeTime',
    type: 'boolean',
    default: 'false',
    title: 'Remove Time (Not for DB version)',
    description: 'Remove time from scheduled and deadline parsing.',
  },
  {
    key: 'gotoShortcut',
    type: 'string',
    default: 'mod+g',
    title: 'Set shortcut of Go to Date',
    description:
      '(Requires restarting Logseq) Modify the shortcut to trigger the pop-up for Go to Date.',
  },
  {
    key: 'completeTaskShortcut',
    type: 'string',
    default: 'mod+shift+d',
    title: 'Set shortcut to Complete Task (Not for DB version)',
    description:
      '(Requires restarting Logseq) Modify the shortcut to mark a task complete.',
  },
  {
    key: 'specialCharHeading',
    type: 'heading',
    default: '',
    title: 'Set Special Character',
    description:
      "Ensure the options below do not overlap. If you are not using the character, please choose 'NA'",
  },
  {
    key: 'dateChar',
    type: 'enum',
    default: '@',
    enumChoices: ['@', '%', '^', 'NA'],
    enumPicker: 'select',
    title: 'Character for Date',
    description:
      'Sets the character when doing parsing for date. Reload the plugin after changing this setting.',
  },
  {
    key: 'scheduledChar',
    type: 'enum',
    default: 'NA',
    enumChoices: ['@', '%', '^', 'NA'],
    enumPicker: 'select',
    title: 'Character for Scheduled (not for DB version)',
    description:
      'Sets the character when doing parsing for scheduled. Reload the plugin after changing this setting.',
  },
  {
    key: 'deadlineChar',
    type: 'enum',
    default: 'NA',
    enumChoices: ['@', '%', '^', 'NA'],
    enumPicker: 'select',
    title: 'Character for Deadline (not for DB version)',
    description:
      'Sets the character when doing parsing for deadline. Reload the plugin after changing this setting.',
  },
  {
    key: 'startOfWeek',
    type: 'enum',
    default: 'Monday',
    enumChoices: ['Monday', 'Sunday', 'Saturday'],
    enumPicker: 'select',
    title: 'Start of Week',
    description: 'Indicate the start day of the week (for week review)',
  },
]
