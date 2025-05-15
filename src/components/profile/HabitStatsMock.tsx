import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Gauge,
  Activity,
  BarChart,
  CirclePercent,
  ChartLine,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useTranslation } from "react-i18next"

const mockStats = {
  totalHabits: 8,
  completedThisWeek: 29,
  completionRate: 92,
  currentStreak: 5,
  longestStreak: 10,
  weeklyProgress: [
    { day: "Seg", completed: 4, total: 4 },
    { day: "Ter", completed: 3, total: 4 },
    { day: "Qua", completed: 4, total: 4 },
    { day: "Qui", completed: 4, total: 4 },
    { day: "Sex", completed: 3, total: 4 },
    { day: "Sáb", completed: 4, total: 4 },
    { day: "Dom", completed: 2, total: 4 },
  ],
}

export default function HabitStatsMock() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("statistics.registeredHabits")}
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalHabits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("statistics.completedThisWeek")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.completedThisWeek}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("statistics.completionRate")}
            </CardTitle>
            <CirclePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.completionRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("statistics.currentStreak")}
            </CardTitle>
            <ChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.currentStreak} {t("statistics.days")}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("calendar.longestStreak")}: {mockStats.longestStreak}{" "}
              {t("statistics.days")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("statistics.weeklyProgress")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("statistics.days")}</TableHead>
                <TableHead>{t("statistics.progress")}</TableHead>
                <TableHead className="text-right">
                  % {t("statistics.complete")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStats.weeklyProgress.map((day, idx) => (
                <TableRow key={day.day}>
                  <TableCell>{day.day}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(day.completed / day.total) * 100}
                        className="h-2"
                      />
                      <span className="text-xs text-muted-foreground">
                        {day.completed}/{day.total}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {Math.round((day.completed / day.total) * 100)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
