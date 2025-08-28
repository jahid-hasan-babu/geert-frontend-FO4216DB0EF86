"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi"
import { notificationSchema, type NotificationFormData } from "@/lib/validations/notification"
import { toast } from "sonner"
import { useCreateNotificationMutation } from "@/redux/features/notification/notificationsApi"

export default function NotificationPage() {
  const [sendTo, setSendTo] = useState("All")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof NotificationFormData, string>>>({})

  const { data, isLoading } = useGetAllCoursesQuery({})
  const [createNotification, { isLoading: isCreating }] = useCreateNotificationMutation()
  const course = data?.data?.data

  const recipients = [
    { value: "All", label: "All" },
    ...(isLoading
      ? []
      : (course?.map((c: { id: string; title: string }) => ({
          value: c.id,
          label: c.title,
        })) ?? [])),
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Prepare form data
    const formData = {
      sendTo,
      title,
      body: message,
    }

    // Validate with Zod
    const validation = notificationSchema.safeParse(formData)

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof NotificationFormData, string>> = {}
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof NotificationFormData] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    try {
      await createNotification(validation.data).unwrap()
      toast.success("Notification sent successfully!")

      // Reset form
      setSendTo("All")
      setTitle("")
      setMessage("")
    } catch (error) {
      console.error("Failed to send notification:", error)
      toast.error("Failed to send notification. Please try again.")
    }
  }

  return (
    <div className="mx-auto p-6 bg-white">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Make Notification</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Send To</label>
              <Select value={sendTo} onValueChange={setSendTo}>
                <SelectTrigger className="w-full h-12 border-gray-200 rounded-lg cursor-pointer">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  {recipients.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sendTo && <p className="text-sm text-red-600 mt-1">{errors.sendTo}</p>}
            </div>

            {/* Title Input */}
            <div>
              <label className="text-sm font-medium text-gray-600">Title</label>
              <Input
                placeholder="Write title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 border-gray-200 rounded-lg"
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Send Message</label>
            <Textarea
              placeholder="Write here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] border-gray-200 rounded-lg resize-none"
            />
            {errors.body && <p className="text-sm text-red-600 mt-1">{errors.body}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isCreating}
          className="w-full h-14 bg-[#3399CC] hover:bg-[#61b1da] text-white font-medium rounded-full text-lg cursor-pointer disabled:opacity-50"
        >
          {isCreating ? "Sending..." : "Make Notification"}
        </Button>
      </form>
    </div>
  )
}
