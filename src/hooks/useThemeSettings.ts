import { useEffect, useState } from "react"
import { Theme, Language } from "@/types/preferences"
import { preferencesService } from "@/services/preferences"

export function useThemeSettings() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme")
    return (savedTheme as Theme) || Theme.SYSTEM
  })

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (theme === Theme.SYSTEM) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    return theme
  })

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (newTheme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
    } else {
      root.classList.add(newTheme)
      setResolvedTheme(newTheme)
    }
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
    } else {
      root.classList.add(theme)
      setResolvedTheme(theme)
    }

    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    if (theme === Theme.SYSTEM) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? "dark" : "light"
        setResolvedTheme(newTheme)
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(newTheme)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  // Carrega as preferências do usuário ao iniciar
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferences = await preferencesService.getPreferences()
        updateTheme(preferences.theme)
      } catch (error) {
        console.error("Erro ao carregar preferências:", error)
      }
    }
    loadPreferences()
  }, [])

  return {
    theme,
    resolvedTheme,
    setTheme: updateTheme,
  }
}
