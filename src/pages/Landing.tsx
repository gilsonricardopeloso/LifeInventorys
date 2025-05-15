import { LoginForm } from "@/components/auth/LoginForm"
import { useTranslation } from "react-i18next"

interface LandingProps {
  onLogin?: () => void
}

const Landing = ({ onLogin }: LandingProps) => {
  const { t } = useTranslation()
  const settings = localStorage.getItem("preferences")
  if (settings) {
    const { theme } = JSON.parse(settings)
    console.log(theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      <div className="container mx-auto px-8">
        <nav className="flex items-center justify-between py-8">
          <h1 className="text-2xl font-bold text-primary">Life Inventory</h1>
        </nav>

        <div className="flex flex-col lg:flex-row items-center justify-between py-20 gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold">
              {t("landing.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("landing.subtitle")}
            </p>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md p-8 rounded-xl bg-card shadow-lg border">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                {t("landing.loginTitle")}
              </h3>
              <LoginForm onLogin={onLogin} />
              {/*  <p className="text-sm text-center mt-4 text-muted-foreground">
                {t("landing.loginHint")}
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
