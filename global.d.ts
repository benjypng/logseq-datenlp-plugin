export interface PluginSettings {
  preferredDateFormat: string
  semiAuto: boolean
  insertDateProperty: boolean
  lang: 'en' | 'ja' | 'fr' | 'nl' | 'ru' | 'de' | 'pt'
  dateChar: string
  scheduledChar: string
  deadlineChar: string
  removeTime: boolean
  gotoShortcut: string
  completeTaskShortcut: string
}

declare global {
  interface LSPluginBaseInfo {
    id: string
    mode: 'shadow' | 'iframe'
    settings: {
      disabled: boolean
      [key: string]: any
    } & PluginSettings
    [key: string]: any
  }

  const logseq: LSPluginBaseInfo
}
