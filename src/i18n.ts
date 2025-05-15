import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import translations
import enTranslations from "./translations/en.json"
import ptBRTranslations from "./translations/pt-BR.json"

// Get initial language from localStorage or use browser language
const getInitialLanguage = () => {
  const storedLanguage = localStorage.getItem("language")
  if (storedLanguage) return storedLanguage

  const browserLanguage = navigator.language
  return browserLanguage.startsWith("pt") ? "pt-BR" : "en"
}

let isLoading = true

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      "pt-BR": {
        translation: ptBRTranslations,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "language",
    },
  })
  .then(() => {
    isLoading = false
  })

// Ensure language is saved in localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng)
})

export { isLoading }
export default i18n
