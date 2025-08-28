import { z } from "zod"

export const notificationSchema = z.object({
  sendTo: z.string().min(1, "Please select a recipient"),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  body: z.string().min(1, "Message is required").max(500, "Message must be less than 500 characters"),
})

export type NotificationFormData = z.infer<typeof notificationSchema>
