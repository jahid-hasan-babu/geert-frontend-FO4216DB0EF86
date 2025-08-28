"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type QuizOption = { id: string; text: string; questionId: string; };
export type QuizQuestion = {
  id: string;
  text: string;
  type: "SINGLE_CHOICE" | "MULTI_CHOICE" | "ORDERING" | "SCALE" | "TEXT";
  options: QuizOption[];
};
export type Quiz = { id: string; title: string; questions: QuizQuestion[]; locked: boolean; };

interface QuizModalProps {
  quiz: Quiz | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, isOpen, onClose }) => {
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({});

  if (!quiz) return null;

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log("User Answers:", answers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <h2 className="text-xl font-bold mb-4">{quiz.title}</h2>

        {quiz.questions.map((q) => (
          <div key={q.id} className="mb-6">
            <p className="mb-2 font-medium">{q.text}</p>
            {q.type === "SINGLE_CHOICE" && (
              <RadioGroup
                value={answers[q.id] as string || ""}
                onValueChange={(val) => handleAnswerChange(q.id, val)}
              >
                {q.options.map(opt => (
                  <div key={opt.id} className="flex items-center space-x-2 mb-1">
                    <RadioGroupItem value={opt.text} id={opt.id} />
                    <Label htmlFor={opt.id}>{opt.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            {q.type === "TEXT" && (
              <textarea
                value={answers[q.id] as string || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full border p-2 rounded"
              />
            )}
            {/* MULTI_CHOICE, ORDERING, SCALE can be added similarly */}
          </div>
        ))}

        <Button onClick={handleSubmit} className="mt-4">
          Submit Quiz
        </Button>
      </DialogContent>
    </Dialog>
  );
};
