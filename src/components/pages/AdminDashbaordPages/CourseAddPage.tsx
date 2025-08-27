/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-assign-module-variable */
"use client"

import type React from "react"

import { useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Info, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CourseModuleAdd from "./CourseModuleAdd"
import {
  useAddMicroLearningMutation,
} from "@/redux/features/courses/coursesApi"
import { z } from "zod"
import { useGetCoursesCategoryQuery, useGetUserQuery } from "@/redux/features/users&category/usersCategoryApi"
import { toast } from "sonner"

const courseValidationSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  duration: z.string().min(1, "Duration is required"),
  instructorId: z.string().min(1, "Instructor is required"),
  instructorEmail: z.string().email("Valid email is required"),
})

type Lesson = {
  lessonType: "video" | "DOCS" | "QUIZ"
  lessonTitle: string
  lessonDuration: string
  lessonVideoName: string
  lessonVideoFile?: File
}

type Quiz = {
  question: string
  answer: string
  options: string[]
}

type Module = {
  moduleTitle: string
  lessons: Lesson[]
  quizzes?: Quiz[]
}

type Category = {
  id: string
  name: string
}

type Instructor = {
  id: string
  username: string
}

export default function CourseAddPage() {
  const pathname = usePathname()
  const isMicroLearning = pathname === "/dashboard/micro-learning/add-microLearning"

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCoursesCategoryQuery({})
  const { data: instructorsResponse, isLoading: isInstructorsLoading } = useGetUserQuery({ filter: "INSTRUCTOR" })
  const [addMicroLearning, { isLoading: isSubmitting }] = useAddMicroLearningMutation()

  const categories = categoriesResponse?.data?.data || []
  const instructors = instructorsResponse?.data?.data || []

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    categoryId: "",
    duration: "",
    instructorId: "",
    instructorEmail: "",
  })

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageName, setCoverImageName] = useState("")
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [modules, setModules] = useState<Module[]>([
    {
      moduleTitle: "",
      lessons: [
        {
          lessonType: "video",
          lessonTitle: "",
          lessonDuration: "",
          lessonVideoName: "",
        },
      ],
      quizzes: [],
    },
  ])

  const handleCoverClick = () => coverInputRef.current?.click()

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0])
      setCoverImageName(e.target.files[0].name)
      console.log("Selected cover image:", e.target.files[0])
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [field]: value }))
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const validateForm = (): boolean => {
    try {
      courseValidationSchema.parse(courseData)

      // Additional validation for modules
      if (modules.length === 0) {
        setValidationErrors(["At least one module is required"])
        return false
      }

      for (let i = 0; i < modules.length; i++) {
        const module = modules[i]
        if (!module.moduleTitle.trim()) {
          setValidationErrors([`Module ${i + 1} title is required`])
          return false
        }

        if (module.lessons.length === 0) {
          setValidationErrors([`Module ${i + 1} must have at least one lesson`])
          return false
        }

        for (let j = 0; j < module.lessons.length; j++) {
          const lesson = module.lessons[j]
          if (!lesson.lessonTitle.trim()) {
            setValidationErrors([`Module ${i + 1}, Lesson ${j + 1} title is required`])
            return false
          }
          if (!lesson.lessonDuration.trim()) {
            setValidationErrors([`Module ${i + 1}, Lesson ${j + 1} duration is required`])
            return false
          }
        }
      }

      setValidationErrors([])
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => err.message)
        setValidationErrors(errors)
      }
      return false
    }
  }

  const handleSave = async () => {
    console.log("[v0] Starting form submission...")

    if (!validateForm()) {
      toast("Please fix the form errors before submitting.")
      return
    }

    try {
      const formData = new FormData()

      const bodyData = {
        title: courseData.title,
        description: courseData.description,
        categoryId: courseData.categoryId,
        duration: courseData.duration,
        price: 59, // Default price as shown in declarations
        isMicroLearning: isMicroLearning,
        instructorId: courseData.instructorId,
        modules: modules.map((mod) => ({
          title: mod.moduleTitle,
          lessons: mod.lessons.map((lesson) => ({
            type: lesson.lessonType,
            title: lesson.lessonTitle,
            description: lesson.lessonTitle, // Using title as description
            duration: lesson.lessonDuration,
            durationSecs: Number.parseInt(lesson.lessonDuration.replace(/\D/g, "")) * 60 || 120,
          })),
          quizzes:
            mod.quizzes?.map((quiz) => ({
              title: quiz.question,
              questions: [
                {
                  text: quiz.question,
                  type: "SINGLE_CHOICE",
                  options:
                    quiz.options?.map((opt, index) => ({
                      text: opt,
                      isCorrect: index === 0, // First option as correct by default
                    })) || [],
                },
              ],
            })) || [],
        })),
      }

      console.log("[v0] BodyData structure:", bodyData)
      formData.append("bodyData", JSON.stringify(bodyData))

      if (coverImageFile) {
        console.log("[v0] Adding cover image:", coverImageFile.name)
        formData.append("coverImage", coverImageFile)
      }

      const videoFiles: File[] = []
      const videoMetadata: any[] = []

      modules.forEach((module, moduleIndex) => {
        module.lessons.forEach((lesson, lessonIndex) => {
          if (lesson.lessonVideoFile && lesson.lessonType === "video") {
            videoFiles.push(lesson.lessonVideoFile)
            videoMetadata.push({
              moduleIndex,
              lessonIndex,
              fileName: lesson.lessonVideoFile.name,
              videoIndex: videoFiles.length - 1,
              lessonTitle: lesson.lessonTitle,
              moduleTitle: module.moduleTitle,
              duration: lesson.lessonDuration,
            })
            console.log("[v0] Adding video file:", lesson.lessonVideoFile.name, "to videoFiles array")
          }
        })
      })

      videoFiles.forEach((file) => {
        formData.append("videoUrl", file)
      })

      // Append video metadata as JSON string
      if (videoMetadata.length > 0) {
        formData.append("videoMetadata", JSON.stringify(videoMetadata))
      }

      console.log("[v0] Total video files:", videoFiles.length)
      console.log("[v0] FormData entries:")
      for (const [key, value] of formData.entries()) {
        console.log(`[v0] ${key}:`, value instanceof File ? `File: ${value.name}` : value)
      }

      console.log("[v0] Submitting to RTK mutation...")

      const result = await addMicroLearning({ formData }).unwrap()
      console.log("[v0] Course creation successful:", result)

      toast("Success! Course created successfully!")
     
      setCourseData({
        title: "",
        description: "",
        categoryId: "",
        duration: "",
        instructorId: "",
        instructorEmail: "",
      })
      setModules([
        {
          moduleTitle: "",
          lessons: [
            {
              lessonType: "video",
              lessonTitle: "",
              lessonDuration: "",
              lessonVideoName: "",
            },
          ],
          quizzes: [],
        },
      ])
      setCoverImageFile(null)
      setCoverImageName("")
      setValidationErrors([])
    } catch (err: any) {
      console.log("[v0] Error creating course:", err)
      const errorMessage = err?.data?.message || err?.message || "Unknown error occurred"
      console.log(errorMessage)

      toast(`Error: Failed to create course: ${errorMessage}`)
    }
  }

  // Show loading state
  if (isCategoriesLoading || isInstructorsLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="mx-auto p-6 space-y-8 bg-white">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-8">
          <div
            onClick={handleCoverClick}
            className="cursor-pointer border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50/30 hover:bg-blue-100 transition"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 font-medium">{coverImageName ? coverImageName : "Upload Cover Image"}</p>
          </div>
          <input type="file" ref={coverInputRef} onChange={handleCoverChange} className="hidden" accept="image/*" />
        </CardContent>
      </Card>

      {/* Course Details */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Course Details</h2>
        <div className="space-y-4 border-2 border-gray-100 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-[#585858] mb-2">Course Title *</label>
            <Input
              placeholder="Write title"
              value={courseData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#585858] mb-2">Description *</label>
            <Textarea
              placeholder="Write course description..."
              value={courseData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Category *</label>
              <Select value={courseData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: Category) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Duration *</label>
              <div className="relative">
                <Select value={courseData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hr">1 hour</SelectItem>
                    <SelectItem value="2hr">2 hours</SelectItem>
                    <SelectItem value="3hr">3 hours</SelectItem>
                    <SelectItem value="5hr30m">5 hr 30m</SelectItem>
                    <SelectItem value="10hr">10 hours</SelectItem>
                  </SelectContent>
                </Select>
                <Info className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CourseModuleAdd modules={modules} setModules={setModules} isMicroLearning={isMicroLearning} />

      {/* Instructor */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Instructor Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name *</label>
            <Select value={courseData.instructorId} onValueChange={(value) => handleInputChange("instructorId", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((ins: Instructor) => (
                  <SelectItem key={ins.id} value={ins.id}>
                    {ins.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Email *</label>
            <Input
              type="email"
              placeholder="Write here"
              value={courseData.instructorEmail}
              onChange={(e) => handleInputChange("instructorEmail", e.target.value)}
              className="w-full"
              required
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSubmitting}
        className="w-full bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer py-3 text-lg font-medium"
      >
        {isSubmitting ? "Creating Course..." : "Save"}
      </Button>
    </div>
  )
}
