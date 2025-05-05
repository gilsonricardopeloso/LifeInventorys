import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Habit } from "@/types/habit"
import { useTranslation } from "react-i18next"

// Form schema validation
const habitSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(500).optional(),
  frequency: z.enum(["daily", "weekly", "custom"]),
  target: z.number().min(1).max(100),
  reminderTime: z.string().optional(),
  category: z.string().optional(),
})

interface HabitFormProps {
  onSubmit: (data: z.infer<typeof habitSchema>) => void
  habit?: Habit
}

function HabitForm({ onSubmit, habit }: HabitFormProps) {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof habitSchema>>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
      frequency: habit?.frequency || "daily",
      target: habit?.target || 1,
      reminderTime: habit?.reminderTime || "",
      category: habit?.category || "",
    },
  })

  const categories = [
    { value: "health", label: t("habits.categories.health") },
    { value: "productivity", label: t("habits.categories.productivity") },
    { value: "fitness", label: t("habits.categories.fitness") },
    { value: "learning", label: t("habits.categories.learning") },
    { value: "mindfulness", label: t("habits.categories.mindfulness") },
    { value: "social", label: t("habits.categories.social") },
    { value: "other", label: t("habits.categories.other") },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("habits.name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("habits.namePlaceholder")} {...field} />
              </FormControl>
              <FormDescription>{t("habits.nameDesc")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("habits.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("habits.descriptionPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("habits.frequency")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("habits.selectFrequency")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">{t("habits.daily")}</SelectItem>
                    <SelectItem value="weekly">{t("habits.weekly")}</SelectItem>
                    <SelectItem value="custom">{t("habits.custom")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("habits.target")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>{t("habits.targetDesc")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="reminderTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("habits.reminder")}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>{t("habits.reminderDesc")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("habits.category")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("habits.selectCategory")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t("habits.cancel")}
            </Button>
          </DialogClose>
          <Button type="submit">
            {habit ? t("habits.update") : t("habits.create")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default HabitForm
