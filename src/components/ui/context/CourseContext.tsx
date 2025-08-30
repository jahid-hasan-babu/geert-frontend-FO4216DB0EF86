"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ChevronDown, CheckCircle, Play, Lock } from "lucide-react";
import CourseCertification from "@/components/certification/CourseCertification";
import { QuizModal, Quiz } from "../modals/QuizModal";

// ----------------- Types -----------------
export interface LessonsItem {
  id: string;
  title: string;
  type: "video" | "doc" | "quiz";
  duration?: string;
  durationSecs?: number;
  completed?: boolean;
  videoUrl?: string;
  quiz?: Quiz;
  locked: boolean; // backend provides
}

export interface Module {
  id: string;
  title: string;
  lessons: LessonsItem[];
  locked?: boolean;
}

interface CourseContextType {
  modules: Module[];
  currentLesson: LessonsItem | null;
  setCurrentLesson: (lesson: LessonsItem) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourse must be used within CourseProvider");
  return context;
};

export const CourseProvider: React.FC<{
  modules: Module[];
  children: ReactNode;
}> = ({ modules, children }) => {
  const [currentLesson, setCurrentLesson] = useState<LessonsItem | null>(
    modules
      .flatMap((m) => m.lessons)
      .find((l) => !l.locked && l.type === "video") || null
  );

  return (
    <CourseContext.Provider
      value={{ modules, currentLesson, setCurrentLesson }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// ----------------- Sidebar -----------------
interface CourseSidebarProps {
  modules: Module[];
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({ modules }) => {
  const { setCurrentLesson } = useCourse();
  const [openModuleId, setOpenModuleId] = useState<string | null>(
    modules[0]?.id || null
  );
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const toggleModule = (id: string) => {
    setOpenModuleId((prev) => (prev === id ? null : id));
    setIsCertOpen(false);
  };

  const toggleCertification = () => {
    setOpenModuleId(null);
    setIsCertOpen((prev) => !prev);
  };

  const openQuiz = (quiz: Quiz | null) => {
    setCurrentQuiz(quiz);
    setQuizModalOpen(true);
  };

  const handleLessonClick = (lesson: LessonsItem) => {
    const isLocked =
      lesson.type === "quiz"
        ? lesson.quiz?.locked ?? lesson.locked
        : lesson.locked;
    if (isLocked) return;

    if (lesson.type === "video") setCurrentLesson(lesson);
    else if (lesson.type === "quiz" && lesson.quiz) openQuiz(lesson.quiz);
  };

  return (
    <div className="space-y-4">
      {modules.map((module, idx) => (
        <div
          key={module.id}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleModule(module.id)}
            className={`w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
              openModuleId === module.id ? "border-b border-[#E7E7E7]" : ""
            }`}
          >
            <h3 className="text-[16px] font-semibold text-gray-900 text-left">
              Lesson {idx + 1}: {module.title}
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 transform ${
                openModuleId === module.id ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              openModuleId === module.id
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white">
              {module.lessons.map((lesson, idx) => {
                const isLocked =
                  lesson.type === "quiz"
                    ? lesson.quiz?.locked ?? lesson.locked
                    : lesson.locked;

                console.log("Lesson", lesson);
                console.log(`isLocked: ${isLocked}`, lesson.title);

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center p-4 border-b border-gray-100 last:border-b-0 ${
                      isLocked
                        ? "bg-gray-50 cursor-not-allowed opacity-60"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          lesson.completed
                            ? "bg-green-500 border-green-500"
                            : !isLocked
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {lesson.completed && !isLocked && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {isLocked && !lesson.completed && (
                          <Lock className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      {idx < module.lessons.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-2" />
                      )}
                    </div>

                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h4
                          className={`font-medium ${
                            isLocked ? "text-gray-400" : "text-gray-900"
                          }`}
                        >
                          {lesson.title}
                          {isLocked && (
                            <span className="ml-2 text-xs text-gray-400">
                              (Locked)
                            </span>
                          )}
                        </h4>
                        <p
                          className={`text-sm ${
                            isLocked ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {lesson.type === "video"
                            ? `Video: ${lesson.duration}`
                            : lesson.type === "quiz"
                            ? "Quiz"
                            : lesson.duration}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {lesson.type === "quiz" && lesson.quiz && !isLocked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openQuiz(lesson.quiz ?? null);
                            }}
                            className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                          >
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          </button>
                        )}
                        {lesson.type === "video" && !isLocked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentLesson(lesson);
                            }}
                            className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                          >
                            <Play className="w-5 h-5 text-gray-600" />
                          </button>
                        )}
                        {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Certification */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={toggleCertification}
          className={`w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
            isCertOpen ? "border-b border-[#E7E7E7]" : ""
          }`}
        >
          <h3 className="text-[16px] font-semibold text-gray-900">
            Certification
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform duration-300 transform ${
              isCertOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isCertOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <CourseCertification courseId="" />
        </div>
      </div>

      {/* Quiz Modal */}
      <QuizModal
        quiz={currentQuiz}
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        courseId={modules[0]?.id || ""}
      />
    </div>
  );
};

export default CourseContext;
