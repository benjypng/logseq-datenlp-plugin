export type PluginSettings = {
  preferredDateFormat: string;
  semiAuto: boolean;
  insertDateProperty: boolean;
  lang: "en" | "ja" | "fr" | "nl" | "ru" | "de" | "pt";
  dateChar: string;
  scheduledChar: string;
  deadlineChar: string;
};
