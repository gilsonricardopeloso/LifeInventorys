import { Check, MoreVertical, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Habit } from "@/types/habit"
import { useTranslation } from "react-i18next"

interface HabitCardProps {
  habit: Habit
  onComplete: (habitId: string) => void
  onDelete: (habitId: string) => void
  onEdit: (habit: Habit) => void
  streak: number
  completedToday: boolean
}

function HabitCard({
  habit,
  onComplete,
  onDelete,
  onEdit,
  streak,
  completedToday,
}: HabitCardProps) {
  const { t } = useTranslation()

  // Status styling based on completion
  const statusClass = completedToday
    ? "habit-card-success"
    : streak === 0
    ? "habit-card-danger"
    : "habit-card-warning"

  // Generate streak dots
  const maxDisplayDots = 7
  const streakDots = Array.from({ length: maxDisplayDots }, (_, i) => {
    if (i === 0) return completedToday ? "completed" : "missed"
    if (i <= streak) return "completed"
    return "pending"
  })

  return (
    <Card className={`habit-card ${statusClass}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">{habit.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("habits.actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              {t("habits.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(habit.id)}
              className="text-destructive"
            >
              <Trash className="h-4 w-4 mr-2" />
              {t("habits.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pt-2">
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-2">
            {habit.description}
          </p>
        )}

        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-medium">
            {habit.frequency === "daily"
              ? t("habits.daily")
              : habit.frequency === "weekly"
              ? t("habits.weekly", { target: habit.target })
              : t("habits.custom")}
          </span>
          {habit.category && (
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {t(`habits.categories.${habit.category.toLowerCase()}`)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mt-3">
          <span className="text-xs font-medium mr-1">
            {t("habits.streak")}:
          </span>
          {streakDots.map((status, i) => (
            <span
              key={i}
              className={`streak-dot streak-dot-${status}`}
              title={
                status === "completed"
                  ? t("habits.completed")
                  : status === "missed"
                  ? t("habits.missed")
                  : t("habits.pending")
              }
            />
          ))}
          {streak > maxDisplayDots && (
            <span className="text-xs ml-1">+{streak - maxDisplayDots}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={() => onComplete(habit.id)}
          variant={completedToday ? "outline" : "default"}
          size="sm"
          className="w-full"
          disabled={completedToday}
        >
          {completedToday ? (
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              {t("habits.completed")}
            </span>
          ) : (
            t("habits.complete")
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default HabitCard
