import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const callSettings = () => {
  const settings: SettingSchemaDesc[] = [
    {
      key: "auto",
      type: "boolean",
      default: false,
      title: "Auto Parsing",
      description:
        "Enables/disables auto-parsing. Please note that turning this on will indiscriminately parse anything you type. Recommended to turn off unless you really need it.",
    },
    {
      key: "semiAuto",
      type: "boolean",
      default: true,
      title: "Semi-auto Parsing",
      description:
        "Enables/disables semi-auto parsing. This is recommended over completely auto parsing. You can trigger the parsing by using the @ sign, e.g. @tomorrow. Please refer to the Readme for more semi-auto parsing functions.",
    },
    {
      key: "lang",
      type: "enum",
      default: "",
      enumChoices: ["", "en", "ja", "fr", "nl", "ru", "de", "pt", "zh"],
      enumPicker: "select",
      title: "Set language",
      description:
        "Set language of parser. Supports en, ja, fr, nl and ru. (de, pt, and zh are partially supported).",
    },
    {
      key: "notifications",
      type: "boolean",
      default: false,
      title: "Turn on Notifications",
      description: "Turn on notifications feature (for scheduled items only)",
    },
    {
      key: "defaultSnooze",
      type: "number",
      default: 5,
      title: "Default snooze duration (mins)",
      description:
        "When using notifications, this setting sets the default snooze time (in minutes)",
    },
    {
      key: "useBlockAsAlarmTitle",
      type: "boolean",
      default: true,
      title: "Use Block's Content as Notification Title",
      description:
        "When using notifications, use the block content as the notification title instead of the default",
    },
  ];

  logseq.useSettingsSchema(settings);
};
