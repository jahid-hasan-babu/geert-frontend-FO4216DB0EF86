"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, Trash2 } from "lucide-react";
import { Textarea } from "@headlessui/react";
import CourseQuiz from "./CourseQuiz";
import MicroLearningQuiz from "./MicroLearningQuiz";

type Lesson = {
  lessonType: "video" | "docs" | "";
  lessonTitle: string;
  lessonDuration: string;
  lessonVideoName: string;
};

type Quiz = {
  question: string;
  answer: string;
  options: string[];
};

type Module = {
  moduleTitle: string;
  lessons: Lesson[];
  quizzes?: Quiz[];
};

type Props = {
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  isMicroLearning: boolean;
};

export default function CourseModuleAdd({
  modules,
  setModules,
  isMicroLearning,
}: Props) {
  const handleModuleChange = (index: number, value: string) => {
    setModules((prev) =>
      prev.map((m, i) => (i === index ? { ...m, moduleTitle: value } : m))
    );
  };

  const addModule = () => {
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
    ]);
  };

  const removeModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Lesson handlers ---
  const handleLessonChange = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string
  ) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              lessons: m.lessons.map((l, li) =>
                li === lessonIndex ? { ...l, [field]: value } : l
              ),
            }
          : m
      )
    );
  };

  const handleVideoChange = (
    moduleIndex: number,
    lessonIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const fileName = e.target.files[0].name;
    handleLessonChange(moduleIndex, lessonIndex, "lessonVideoName", fileName);
  };

  const addLesson = (moduleIndex: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  lessonType: "video",
                  lessonTitle: "",
                  lessonDuration: "",
                  lessonVideoName: "",
                },
              ],
            }
          : m
      )
    );
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? { ...m, lessons: m.lessons.filter((_, li) => li !== lessonIndex) }
          : m
      )
    );
  };

  // --- Quiz handlers ---
  const addQuiz = (moduleIndex: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              quizzes: [
                ...(m.quizzes || []),
                { question: "", answer: "", options: [""] },
              ],
            }
          : m
      )
    );
  };

  const removeQuiz = (moduleIndex: number, quizIndex: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              quizzes: m.quizzes?.filter((_, qi) => qi !== quizIndex),
            }
          : m
      )
    );
  };

  const handleQuizChange = (
    moduleIndex: number,
    quizIndex: number,
    field: keyof Quiz,
    value: string
  ) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              quizzes: m.quizzes?.map((q, qi) =>
                qi === quizIndex ? { ...q, [field]: value } : q
              ),
            }
          : m
      )
    );
  };

  const handleOptionChange = (
    moduleIndex: number,
    quizIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              quizzes: m.quizzes?.map((q, qi) =>
                qi === quizIndex
                  ? {
                      ...q,
                      options: q.options.map((o, oi) =>
                        oi === optionIndex ? value : o
                      ),
                    }
                  : q
              ),
            }
          : m
      )
    );
  };

  const addOption = (moduleIndex: number, quizIndex: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              quizzes: m.quizzes?.map((q, qi) =>
                qi === quizIndex ? { ...q, options: [...q.options, ""] } : q
              ),
            }
          : m
      )
    );
  };

  const removeOption = (
    moduleIndex: number,
    quizIndex: number,
    optionIndex: number
  ) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              quizzes: m.quizzes?.map((q, qi) =>
                qi === quizIndex
                  ? {
                      ...q,
                      options: q.options.filter((_, oi) => oi !== optionIndex),
                    }
                  : q
              ),
            }
          : m
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Modules</h2>

      {modules.map((module, moduleIndex) => (
        <div
          key={moduleIndex}
          className="space-y-4 border-2 border-gray-100 p-4 rounded-lg relative"
        >
          {/* Remove Module */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-red-500 hover:bg-red-100 cursor-pointer"
            onClick={() => removeModule(moduleIndex)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>

          {/* Module Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module Title
            </label>
            <Input
              placeholder="Write title"
              value={module.moduleTitle}
              onChange={(e) => handleModuleChange(moduleIndex, e.target.value)}
            />
          </div>

          {/* Lessons */}
          {module.lessons.map((lesson, lessonIndex) => (
            <div
              key={lessonIndex}
              className="space-y-4 border border-gray-200 p-4 rounded-lg relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-red-500 hover:bg-red-100 cursor-pointer"
                onClick={() => removeLesson(moduleIndex, lessonIndex)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Lesson Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Type
                  </label>
                  <Select
                    value={lesson.lessonType}
                    onValueChange={(value) =>
                      handleLessonChange(
                        moduleIndex,
                        lessonIndex,
                        "lessonType",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="docs">Docs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lesson Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title
                  </label>
                  <Input
                    placeholder="Write lesson title"
                    value={lesson.lessonTitle}
                    onChange={(e) =>
                      handleLessonChange(
                        moduleIndex,
                        lessonIndex,
                        "lessonTitle",
                        e.target.value
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Lesson Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Duration
                  </label>
                  <Input
                    placeholder="e.g., 5min, 10min, 1hr"
                    value={lesson.lessonDuration}
                    onChange={(e) =>
                      handleLessonChange(
                        moduleIndex,
                        lessonIndex,
                        "lessonDuration",
                        e.target.value
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Video / Docs */}
              {lesson.lessonType === "video" && (
                <Card>
                  <CardContent className="">
                    <div
                      onClick={() =>
                        document
                          .getElementById(`video-${moduleIndex}-${lessonIndex}`)
                          ?.click()
                      }
                      className="cursor-pointer border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50/30 hover:bg-blue-100 transition"
                    >
                      <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 font-medium">
                        {lesson.lessonVideoName || "Upload Lesson Video"}
                      </p>
                    </div>
                    <input
                      type="file"
                      id={`video-${moduleIndex}-${lessonIndex}`}
                      onChange={(e) =>
                        handleVideoChange(moduleIndex, lessonIndex, e)
                      }
                      className="hidden"
                      accept="video/*"
                    />
                  </CardContent>
                </Card>
              )}

              {lesson.lessonType === "docs" && (
                <Card className="py-2">
                  <CardContent className="space-y-4 px-2">
                    <Textarea
                      placeholder="Write here"
                      value={lesson.lessonVideoName}
                      onChange={(e) =>
                        handleLessonChange(
                          moduleIndex,
                          lessonIndex,
                          "lessonVideoName",
                          e.target.value
                        )
                      }
                      className="w-full min-h-[100px] resize-none"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          ))}

          {/* Add Lesson Button */}
          <Button
            onClick={() => addLesson(moduleIndex)}
            className="w-full bg-[#3399CC] hover:bg-[#52b9ec] rounded-full cursor-pointer"
          >
            Add New Lesson
          </Button>

          {/* Quizzes */}
          {module.quizzes?.map((quiz, quizIndex) =>
            isMicroLearning ? (
              <MicroLearningQuiz
                key={quizIndex}
                moduleIndex={moduleIndex}
                quizIndex={quizIndex}
                quiz={quiz}
                handleQuizChange={handleQuizChange}
                handleOptionChange={handleOptionChange}
                addOption={addOption}
                removeOption={removeOption}
                removeQuiz={removeQuiz}
              />
            ) : (
              <CourseQuiz
                key={quizIndex}
                moduleIndex={moduleIndex}
                quizIndex={quizIndex}
                quiz={quiz}
                handleQuizChange={handleQuizChange}
                handleOptionChange={handleOptionChange}
                addOption={addOption}
                removeOption={removeOption}
                removeQuiz={removeQuiz}
              />
            )
          )}

          {/* Add Quiz Button */}
          <Button
            onClick={() => addQuiz(moduleIndex)}
            className="w-full bg-[#C0DFEF] text-black hover:bg-blue-200 rounded-full cursor-pointer mt-2"
          >
            Add Quiz
          </Button>
        </div>
      ))}

      {/* Add Module Button */}
      <Button
        onClick={addModule}
        className="w-full bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer rounded-full"
      >
        Add New Module
      </Button>
    </div>
  );
}
