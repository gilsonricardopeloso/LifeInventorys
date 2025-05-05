import { api } from "@/lib/axios"
import { Theme, Language } from "../types/preferences"

export interface UserPreferences {
  notifications: boolean
  theme: Theme
  language: Language
}

export interface UpdatePreferencesDto {
  preferences: UserPreferences
}

class PreferencesService {
  async getPreferences(): Promise<UserPreferences> {
    const response = await api.get<UserPreferences>("/users/preferences")
    return response.data
  }

  async updatePreferences(
    preferences: UserPreferences
  ): Promise<UserPreferences> {
    const response = await api.patch<UserPreferences>("/users/preferences", {
      preferences,
    })
    return response.data
  }
}

export const preferencesService = new PreferencesService()
