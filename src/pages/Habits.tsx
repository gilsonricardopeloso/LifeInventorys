import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HabitList from "@/components/habits/HabitList"
import mockData from "@/mock-data"
import type { Habit, HabitCompletion } from "@/types/habit"
import { useTranslation } from "react-i18next"

function HabitsPage() {
  const { t } = useTranslation()
  const [habits, setHabits] = useState<Habit[]>(mockData.habits)
  const [completions, setCompletions] = useState<HabitCompletion[]>(
    mockData.completions
  )
  const [completedHabits, setCompletedHabits] = useState<
    Record<string, boolean>
  >({})
  const [habitStreaks, setHabitStreaks] = useState<Record<string, number>>({})

  // Calculate streaks and completions
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check which habits were completed today
    const completed: Record<string, boolean> = {}
    const streaks: Record<string, number> = {}

    habits.forEach((habit) => {
      // Get all completions for this habit, sorted by date
      const habitCompletions = completions
        .filter((c) => c.habitId === habit.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      // Check if habit was completed today
      const todayCompletion = habitCompletions.find((c) => {
        const completionDate = new Date(c.date)
        completionDate.setHours(0, 0, 0, 0)
        return completionDate.getTime() === today.getTime()
      })
      completed[habit.id] = !!todayCompletion

      // Calculate streak
      let currentStreak = 0
      let lastDate = today
      let missedDay = false

      for (const completion of habitCompletions) {
        const completionDate = new Date(completion.date)
        completionDate.setHours(0, 0, 0, 0)
        const dayDiff = Math.floor(
          (lastDate.getTime() - completionDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )

        if (dayDiff === 0) {
          // Same day, skip
          continue
        } else if (dayDiff === 1) {
          // Consecutive day
          currentStreak++
          lastDate = completionDate
        } else {
          // Streak broken
          missedDay = true
          break
        }
      }

      // If we have a completion today, add it to the streak
      if (todayCompletion && !missedDay) {
        currentStreak++
      }

      streaks[habit.id] = currentStreak
    })

    setCompletedHabits(completed)
    setHabitStreaks(streaks)
  }, [habits, completions])

  const handleAddHabit = (
    habitData: Omit<Habit, "id" | "createdAt" | "isArchived">
  ) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      createdAt: new Date(),
      isArchived: false,
      ...habitData,
    }
    setHabits([...habits, newHabit])
  }

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits(
      habits.map((habit) =>
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    )
  }

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter((habit) => habit.id !== habitId))
    // Also remove any completions for this habit
    setCompletions(completions.filter((c) => c.habitId !== habitId))
  }

  const handleCompleteHabit = (habitId: string) => {
    const newCompletion: HabitCompletion = {
      id: `completion-${Date.now()}`,
      habitId,
      date: new Date(),
      completedAt: new Date(),
      value: 1,
    }

    setCompletions([...completions, newCompletion])
    setCompletedHabits({ ...completedHabits, [habitId]: true })
  }

  const activeHabits = habits.filter((h) => !h.isArchived)
  const archivedHabits = habits.filter((h) => h.isArchived)

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">{t("habits.title")}</h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-2 mb-8">
          <TabsTrigger value="active">
            {t("habits.active")} ({activeHabits.length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            {t("habits.archived")} ({archivedHabits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <HabitList
            habits={activeHabits}
            onAddHabit={handleAddHabit}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
            onCompleteHabit={handleCompleteHabit}
            completedHabits={completedHabits}
            habitStreaks={habitStreaks}
          />
        </TabsContent>

        <TabsContent value="archived">
          {archivedHabits.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg">
              <p className="text-lg text-muted-foreground">
                {t("habits.noHabits")}
              </p>
            </div>
          ) : (
            <HabitList
              habits={archivedHabits}
              onAddHabit={handleAddHabit}
              onUpdateHabit={handleUpdateHabit}
              onDeleteHabit={handleDeleteHabit}
              onCompleteHabit={handleCompleteHabit}
              completedHabits={completedHabits}
              habitStreaks={habitStreaks}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HabitsPage
