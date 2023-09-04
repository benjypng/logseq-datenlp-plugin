export type PluginSettings = {
  preferredDateFormat: string;
  auto: boolean;
  semiAuto: boolean;
  lang: "en" | "ja" | "fr" | "nl" | "ru" | "de" | "pt";
  notifications: boolean;
  defaultSnooze: boolean;
  useBlockAsAlarmTitle: boolean;
};
