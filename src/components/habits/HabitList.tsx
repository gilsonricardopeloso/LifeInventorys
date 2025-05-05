/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { useUnifiedButton } from "@/hooks/useUnifiedButton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import HabitCard from "./HabitCard"
import HabitForm from "./HabitForm"
import type { Habit } from "@/types/habit"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface HabitListProps {
  habits: Habit[]
  onAddHabit: (habit: Omit<Habit, "id" | "createdAt" | "isArchived">) => void
  onUpdateHabit: (habit: Habit) => void
  onDeleteHabit: (habitId: string) => void
  onCompleteHabit: (habitId: string) => void
  completedHabits: Record<string, boolean>
  habitStreaks: Record<string, number>
}

function HabitList({
  habits,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onCompleteHabit,
  completedHabits,
  habitStreaks,
}: HabitListProps) {
  const { toast } = useToast()
  const { t } = useTranslation()
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { UnifiedButton } = useUnifiedButton()
  const location = useLocation()
  const navigate = useNavigate()

  const handleAddHabit = (data: any) => {
    onAddHabit(data)
    setAddDialogOpen(false)
    toast({
      title: t("habits.habitCreated", "habits"),
      description: t("habits.habitCreatedDesc", "habits").replace(
        "{name}",
        data.name
      ),
    })
  }

  const handleEditHabit = (data: any) => {
    if (editingHabit) {
      const updatedHabit = { ...editingHabit, ...data }
      onUpdateHabit(updatedHabit)
      setEditingHabit(null)
      setEditDialogOpen(false)
      toast({
        title: t("habits.habitUpdated", "habits"),
        description: t("habits.habitUpdatedDesc", "habits").replace(
          "{name}",
          data.name
        ),
      })
    }
  }

  const handleDeleteHabit = (habitId: string) => {
    onDeleteHabit(habitId)
    toast({
      title: t("habits.habitDeleted", "habits"),
      description: t("habits.habitDeletedDesc", "habits"),
      variant: "destructive",
    })
  }

  const handleEditClick = (habit: Habit) => {
    setEditingHabit(habit)
    setEditDialogOpen(true)
  }

  const handleCompleteHabit = (habitId: string) => {
    onCompleteHabit(habitId)
    toast({
      title: t("habits.habitCompleted", "habits"),
      description: t("habits.successMessage", "habits"),
      variant: "default",
    })
  }

  useEffect(() => {
    if (location.state?.openAddDialog) {
      setAddDialogOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t("habits.yourHabits", "habits")}
        </h2>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <UnifiedButton className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>{t("habits.newHabitButton")}</span>
            </UnifiedButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("habits.createHabit", "habits")}</DialogTitle>
              <DialogDescription>
                {t("habits.createHabitDesc", "habits")}
              </DialogDescription>
            </DialogHeader>
            <HabitForm onSubmit={handleAddHabit} />
          </DialogContent>
        </Dialog>
      </div>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg">
          <p className="text-lg text-muted-foreground mb-4">
            {t("habits.noHabits", "habits")}
          </p>
          <UnifiedButton
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t("habits.createFirst", "habits")}</span>
          </UnifiedButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={handleCompleteHabit}
              onDelete={handleDeleteHabit}
              onEdit={handleEditClick}
              streak={habitStreaks[habit.id] || 0}
              completedToday={completedHabits[habit.id] || false}
            />
          ))}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("habits.editHabit", "habits")}</DialogTitle>
            <DialogDescription>
              {t("habits.editHabitDesc", "habits")}
            </DialogDescription>
          </DialogHeader>
          {editingHabit && (
            <HabitForm onSubmit={handleEditHabit} habit={editingHabit} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HabitList
