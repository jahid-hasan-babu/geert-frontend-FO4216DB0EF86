"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

type Quiz = {
  question: string;
  answer: string;
  options: string[];
};

type Props = {
  moduleIndex: number;
  quizIndex: number;
  quiz: Quiz;
  handleQuizChange: (moduleIndex: number, quizIndex: number, field: keyof Quiz, value: string) => void;
  handleOptionChange: (moduleIndex: number, quizIndex: number, optionIndex: number, value: string) => void;
  addOption: (moduleIndex: number, quizIndex: number) => void;
  removeOption: (moduleIndex: number, quizIndex: number, optionIndex: number) => void;
  removeQuiz: (moduleIndex: number, quizIndex: number) => void;
};

export default function CourseQuiz({
  moduleIndex,
  quizIndex,
  quiz,
  handleQuizChange,
  handleOptionChange,
  addOption,
  removeOption,
  removeQuiz,
}: Props) {
  return (
    <Card className="mt-4 relative py-10">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-red-500 hover:bg-red-100 cursor-pointer"
        onClick={() => removeQuiz(moduleIndex, quizIndex)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <CardContent className="space-y-4">
        <Input
          placeholder="Quiz Question"
          value={quiz.question}
          onChange={(e) =>
            handleQuizChange(moduleIndex, quizIndex, "question", e.target.value)
          }
          className="w-full"
        />
        <Input
          placeholder="Answer"
          value={quiz.answer}
          onChange={(e) =>
            handleQuizChange(moduleIndex, quizIndex, "answer", e.target.value)
          }
          className="w-full"
        />

        {quiz.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex gap-2 items-center">
            <Input
              placeholder={`Option ${optionIndex + 1}`}
              value={option}
              onChange={(e) =>
                handleOptionChange(moduleIndex, quizIndex, optionIndex, e.target.value)
              }
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 cursor-pointer"
              onClick={() => removeOption(moduleIndex, quizIndex, optionIndex)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          onClick={() => addOption(moduleIndex, quizIndex)}
          className="bg-[#C0DFEF] text-black hover:bg-blue-200 rounded-full w-full cursor-pointer"
        >
          Add New Option
        </Button>
      </CardContent>
    </Card>
  );
}
