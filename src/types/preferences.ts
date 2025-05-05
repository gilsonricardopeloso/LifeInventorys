export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum Language {
  PT_BR = "pt-BR",
  EN = "en",
}

export interface UserPreferences {
  notifications: boolean
  theme: Theme
  language: Language
}
