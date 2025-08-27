/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Video, FileText } from "lucide-react"

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

interface CourseModuleAddProps {
  modules: Module[]
  setModules: React.Dispatch<React.SetStateAction<Module[]>>
  isMicroLearning: boolean
}

export default function CourseModuleAdd({ modules, setModules, isMicroLearning }: CourseModuleAddProps) {
  const addNewModule = () => {
    setModules((prev) => [
      ...prev,
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
  }

  const removeModule = (moduleIndex: number) => {
    if (modules.length > 1) {
      setModules((prev) => prev.filter((_, idx) => idx !== moduleIndex))
    }
  }

  const addNewLesson = (moduleIndex: number) => {
    setModules((prev) =>
      prev.map((module, idx) =>
        idx === moduleIndex
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  lessonType: "video",
                  lessonTitle: "",
                  lessonDuration: "",
                  lessonVideoName: "",
                },
              ],
            }
          : module,
      ),
    )
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setModules((prev) =>
      prev.map((module, idx) =>
        idx === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.filter((_, lIdx) => lIdx !== lessonIndex),
            }
          : module,
      ),
    )
  }

  const updateModule = (moduleIndex: number, field: string, value: string) => {
    setModules((prev) => prev.map((module, idx) => (idx === moduleIndex ? { ...module, [field]: value } : module)))
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: string | File) => {
    setModules((prev) =>
      prev.map((module, mIdx) =>
        mIdx === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, lIdx) =>
                lIdx === lessonIndex ? { ...lesson, [field]: value } : lesson,
              ),
            }
          : module,
      ),
    )
  }

  const handleVideoUpload = (moduleIndex: number, lessonIndex: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "video/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        updateLesson(moduleIndex, lessonIndex, "lessonVideoFile", file)
        updateLesson(moduleIndex, lessonIndex, "lessonVideoName", file.name)
        console.log("[v0] Video uploaded:", file.name)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Course Modules</h2>
        <Button onClick={addNewModule} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      {modules.map((module, moduleIndex) => (
        <Card key={moduleIndex} className="border-2 border-gray-100">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Module Header */}
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Module Title *"
                  value={module.moduleTitle}
                  onChange={(e) => updateModule(moduleIndex, "moduleTitle", e.target.value)}
                  className="flex-1"
                  required
                />
                {modules.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeModule(moduleIndex)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Lessons */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Lessons</h4>
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Lesson Title *"
                        value={lesson.lessonTitle}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, "lessonTitle", e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Duration (e.g., 5m) *"
                        value={lesson.lessonDuration}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, "lessonDuration", e.target.value)}
                        required
                      />
                      <Select
                        value={lesson.lessonType}
                        onValueChange={(value: "video" | "DOCS" ) =>
                          updateLesson(moduleIndex, lessonIndex, "lessonType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Lesson Type *" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="DOCS">Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Video Upload */}
                    {lesson.lessonType === "video" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleVideoUpload(moduleIndex, lessonIndex)}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Upload Video
                          </Button>
                          {lesson.lessonVideoName && (
                            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                              {lesson.lessonVideoName}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Document Upload */}
                    {lesson.lessonType === "DOCS" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Upload Document
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Remove Lesson */}
                    <div className="flex justify-end">
                      {module.lessons.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => removeLesson(moduleIndex, lessonIndex)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Lesson
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button onClick={() => addNewLesson(moduleIndex)} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
