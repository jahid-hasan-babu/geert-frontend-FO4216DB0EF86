import { z } from "zod"

export const lessonSchema = z.object({
  lessonType: z.enum(["video", "docs"], {
    errorMap: () => ({ message: "Lesson type is required" }),
  }),
  lessonTitle: z.string().min(1, "Lesson title is required"),
  lessonDuration: z.string().min(1, "Lesson duration is required"),
  lessonVideoName: z.string().optional(),
  lessonVideoFile: z.instanceof(File).optional(),
})

export const quizSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required"),
})

export const moduleSchema = z.object({
  moduleTitle: z.string().min(1, "Module title is required"),
  lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
  quizzes: z.array(quizSchema).optional().default([]),
})

export const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  instructorId: z.string().min(1, "Instructor is required"),
  instructorEmail: z.string().email("Valid email is required"),
})

export const courseFormSchema = z.object({
  courseData: courseSchema,
  modules: z.array(moduleSchema).min(1, "At least one module is required"),
  coverImageFile: z.instanceof(File).optional(),
})

export type CourseFormData = z.infer<typeof courseFormSchema>
export type CourseData = z.infer<typeof courseSchema>
export type ModuleData = z.infer<typeof moduleSchema>
export type LessonData = z.infer<typeof lessonSchema>
export type QuizData = z.infer<typeof quizSchema>

export type Category = {
  id: string
  name: string
}

export type Instructor = {
  id: string
  username: string
  email?: string
}

export type ApiResponse<T> = {
  data: {
    data: T[]
  }
}
