import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const settings: SettingSchemaDesc[] = [
  {
    key: "semiAuto",
    type: "boolean",
    default: true,
    title: "Semi-auto Parsing",
    description:
      "Enables/disables semi-auto parsing. This is recommended over completely auto parsing. You can trigger the parsing by using the @ sign, e.g. @tomorrow. Please refer to the Readme for more semi-auto parsing functions.",
  },
  {
    key: "insertDateProperty",
    type: "boolean",
    default: true,
    title: "Insert Date Property",
    description:
      "If set to true, when parsing dates, a date wil be inserted instead of inline.",
  },
  {
    key: "lang",
    type: "enum",
    default: "en",
    enumChoices: ["en", "ja", "fr", "nl", "ru", "de", "pt", "zh"],
    enumPicker: "select",
    title: "Set language",
    description:
      "Set language of parser. Supports en, ja, fr, nl and ru. (de, pt, and zh are partially supported).",
  },
];
