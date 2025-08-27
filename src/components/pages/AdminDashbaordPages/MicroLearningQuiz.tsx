"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Quiz = {
  question: string;
  answer: string;
  options: string[];
};

type Props = {
  moduleIndex: number;
  quizIndex: number;
  quiz: Quiz;
  handleQuizChange: (
    moduleIndex: number,
    quizIndex: number,
    field: keyof Quiz,
    value: string
  ) => void;
  handleOptionChange: (
    moduleIndex: number,
    quizIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  addOption: (moduleIndex: number, quizIndex: number) => void;
  removeOption: (
    moduleIndex: number,
    quizIndex: number,
    optionIndex: number
  ) => void;
  removeQuiz: (moduleIndex: number, quizIndex: number) => void;
};

export default function MicroLearningQuiz({
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
        <div className="flex gap-x-5">
          <Input
            placeholder="Quiz Question"
            value={quiz.question}
            onChange={(e) =>
              handleQuizChange(
                moduleIndex,
                quizIndex,
                "question",
                e.target.value
              )
            }
            className="w-full"
          />
          <Select
            value={quiz.question}
            onValueChange={(value) =>
              handleQuizChange(moduleIndex, quizIndex, "question", value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Quiz Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single-choice">Single Choice</SelectItem>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="free-choice">Free Choice</SelectItem>
              <SelectItem value="shorting-choice">Shorting Choice</SelectItem>
              <SelectItem value="matrix-shorting-choice">Matrix Shorting Choice</SelectItem>
              <SelectItem value="fill-in-the-blank">Fill in the Blank</SelectItem>
              <SelectItem value="assessment">Assessment (Survey)</SelectItem>
              <SelectItem value="easy">Easy (Open answer)</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                handleOptionChange(
                  moduleIndex,
                  quizIndex,
                  optionIndex,
                  e.target.value
                )
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
