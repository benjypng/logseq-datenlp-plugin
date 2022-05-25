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
  ];

  logseq.useSettingsSchema(settings);
};
