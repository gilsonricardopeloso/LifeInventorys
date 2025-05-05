import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Settings as SettingsIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useThemeSettings } from "@/hooks/useThemeSettings"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { preferencesService } from "@/services/preferences"
import { Theme, Language } from "@/types/preferences"

// Get default settings from localStorage or use initial values
const getInitialSettings = () => {
  const storedSettings = localStorage.getItem("user-settings")
  if (storedSettings) {
    return JSON.parse(storedSettings)
  }
  return {
    notifications: true,
    theme: document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  }
}

export default function Settings() {
  const { t, i18n } = useTranslation()
  const { toast } = useToast()
  const { setTheme: updateTheme } = useThemeSettings()
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState<Theme>(Theme.SYSTEM)
  const [language, setLanguage] = useState<Language>(Language.PT_BR)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferences = await preferencesService.getPreferences()
        setNotifications(preferences.notifications)
        setTheme(preferences.theme)
        setLanguage(preferences.language)
      } catch (error) {
        console.error("Erro ao carregar preferências:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas preferências",
          variant: "destructive",
        })
      }
    }
    loadPreferences()
  }, [toast])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await preferencesService.updatePreferences({
        notifications,
        theme,
        language,
      })
      // Atualiza o tema imediatamente após salvar
      updateTheme(theme)
      toast({
        title: "Sucesso",
        description: "Preferências salvas com sucesso",
      })
    } catch (error) {
      console.error("Erro ao salvar preferências:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas preferências",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = (value: string) => {
    const newLanguage = value as Language
    setLanguage(newLanguage)
    i18n.changeLanguage(newLanguage)
  }

  const handleThemeChange = (value: string) => {
    const newTheme = value as Theme
    setTheme(newTheme)
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <SettingsIcon className="w-7 h-7" /> {t("settings.settings")}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.preferences")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notificações</Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Theme.LIGHT}>Claro</SelectItem>
                <SelectItem value={Theme.DARK}>Escuro</SelectItem>
                <SelectItem value={Theme.SYSTEM}>Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Language.PT_BR}>Português</SelectItem>
                <SelectItem value={Language.EN}>English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Preferências"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
