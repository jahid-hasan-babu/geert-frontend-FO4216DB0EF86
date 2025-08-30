"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type QuizOption = {
  id: string;
  text: string;
  questionId: string;
  value?: string;
};

export type QuizQuestion = {
  id: string;
  text: string;
  type: "SINGLE_CHOICE" | "MULTI_CHOICE" | "ORDERING" | "SCALE" | "TEXT";
  options: QuizOption[];
};

export type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
  locked: boolean;
};

// ✅ Updated type: include number[]
type AnswerValue = string | string[] | number | number[];

interface QuizModalProps {
  quiz: Quiz | null;
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  courseId,
  isOpen,
  onClose,
}) => {
  const [answers, setAnswers] = useState<{ [questionId: string]: AnswerValue }>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quiz) return;

    const startQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/start-quiz/${quiz.id}/${courseId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttemptId(res.data.data.id);
      } catch (err) {
        console.error("Error starting quiz:", err);
      }
    };

    startQuiz();
  }, [quiz, courseId]);

  if (!quiz) return null;

  const handleAnswerChange = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!attemptId) return;

    const payload = quiz.questions.map((q) => {
      const ans = answers[q.id];
      if (!ans) return { questionId: q.id }; // no answer

      switch (q.type) {
        case "SINGLE_CHOICE":
        case "MULTI_CHOICE":
        case "SCALE":
          return {
            questionId: q.id,
            selectedOptionIds: Array.isArray(ans) ? ans : [ans],
          };
        case "ORDERING":
          // map the numbers to the corresponding option IDs
          const numbers = ans as number[];
          const orderedOptionIds = numbers.map((num) => q.options[num - 1]?.id).filter(Boolean);
          return { questionId: q.id, orderedOptionIds };
        case "TEXT":
          return { questionId: q.id, textAnswer: ans as string };
        default:
          return { questionId: q.id };
      }
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/make-ans`,
        { attemptId, answers: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Quiz submitted:", res.data);
      onClose();
    } catch (err) {
      console.error("Error submitting quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[75vh] overflow-scroll">
        <h2 className="text-xl font-bold mb-4">{quiz.title}</h2>

        {quiz.questions.map((q) => (
          <div key={q.id} className="mb-6">
            <p className="mb-2 font-medium">{q.text}</p>

            {q.type === "SINGLE_CHOICE" && (
              <RadioGroup
                value={(answers[q.id] as string) || ""}
                onValueChange={(val) => handleAnswerChange(q.id, val)}
              >
                {q.options.map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-2 mb-1">
                    <RadioGroupItem value={opt.id} id={opt.id} />
                    <Label htmlFor={opt.id}>{opt.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {q.type === "MULTI_CHOICE" && (
              <div>
                {q.options.map((opt) => (
                  <label key={opt.id} className="flex items-center space-x-2 mb-1">
                    <input
                      type="checkbox"
                      value={opt.id}
                      checked={((answers[q.id] as string[]) || []).includes(opt.id)}
                      onChange={(e) => {
                        const prev = (answers[q.id] as string[]) || [];
                        if (e.target.checked) {
                          handleAnswerChange(q.id, [...prev, opt.id]);
                        } else {
                          handleAnswerChange(q.id, prev.filter((id) => id !== opt.id));
                        }
                      }}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "ORDERING" && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Enter the order of the items:</p>
                <ul className="mb-2 list-decimal list-inside">
                  {q.options.map((opt) => (
                    <li key={opt.id}>{opt.text}</li>
                  ))}
                </ul>
                <div className="flex space-x-2">
                  {q.options.map((opt, idx) => (
                    <input
                      key={opt.id}
                      type="number"
                      min={1}
                      max={q.options.length}
                      value={((answers[q.id] as number[]) || [])[idx] || ""}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const prev = [...((answers[q.id] as number[]) || [])];
                        prev[idx] = val;
                        handleAnswerChange(q.id, prev);
                      }}
                      className="border w-12 p-1 rounded text-center"
                    />
                  ))}
                </div>
              </div>
            )}

            {q.type === "SCALE" && (
              <div className="flex space-x-2 items-center">
                <span>Low</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={(answers[q.id] as number) || 3}
                  onChange={(e) => handleAnswerChange(q.id, Number(e.target.value))}
                />
                <span>High</span>
                <span className="ml-2">{answers[q.id] || 3}</span>
              </div>
            )}

            {q.type === "TEXT" && (
              <textarea
                value={(answers[q.id] as string) || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full border p-2 rounded"
              />
            )}
          </div>
        ))}

        <Button onClick={handleSubmit} disabled={loading} className="mt-4">
          {loading ? "Submitting..." : "Submit Quiz"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
