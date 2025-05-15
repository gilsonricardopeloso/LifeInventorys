import HabitStatsMock from "@/components/profile/HabitStatsMock"
import { useTranslation } from "react-i18next"

const Statistics = () => {
  const { t } = useTranslation()

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">{t("statistics.title")}</h1>
      <HabitStatsMock />
    </div>
  )
}

export default Statistics
