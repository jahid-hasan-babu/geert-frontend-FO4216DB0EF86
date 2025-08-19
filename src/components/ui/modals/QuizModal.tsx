"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
}

const quizQuestions = [
  {
    id: 1,
    question: "What does UI stand for?",
    options: [
      { value: "user-insight", label: "User Insight" },
      { value: "unified-interface", label: "Unified Interface" },
      { value: "user-internet", label: "User Internet" },
      { value: "user-interface", label: "User Interface" },
    ],
    defaultValue: "user-insight",
  },
  {
    id: 2,
    question: "What is the main focus of UI design?",
    options: [
      { value: "writing-code", label: "Writing code for back-end systems" },
      { value: "designing-interface", label: "Designing how the interface looks and feels" },
      { value: "conducting-interviews", label: "Conducting user interviews" },
      { value: "managing-campaigns", label: "Managing marketing campaigns" },
    ],
  },
  {
    id: 3,
    question: "What's the difference between UI & UX?",
    options: [
      { value: "ui-easier", label: "UI is easier than UX" },
      { value: "ux-coding", label: "UX is only about coding" },
      { value: "ui-mobile-ux-web", label: "UI is for mobile apps, UX is for websites" },
      { value: "ui-visuals-ux-experience", label: "UI focuses on visuals, UX focuses on experience" },
    ],
  },
  {
    id: 4,
    question: "Which tool is mostly used for UI design?",
    options: [
      { value: "figma", label: "Figma" },
      { value: "wordpress", label: "WordPress" },
      { value: "google-drive", label: "Google Drive" },
      { value: "shopify", label: "Shopify" },
    ],
  },
]

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})


  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = () => {
    console.log("Quiz answers:", answers)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 gap-0 bg-white">
        {/* Header with close button */}
        <div className="flex justify-center items-center p-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 font-playfairDisplay">Introduction Quiz</h2>
          {/* <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button> */}
        </div>

        {/* Quiz content */}
        <div className="px-6 pb-6 space-y-8">
          {quizQuestions.map((question) => (
            <div key={question.id} className="space-y-3">
              <h3 className="text-base font-medium text-gray-900">
                {question.id}. {question.question}
              </h3>
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="space-y-2"
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`${question.id}-${option.value}`}
                      className="text-blue-500"
                    />
                    <Label
                      htmlFor={`${question.id}-${option.value}`}
                      className="text-gray-700 font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
