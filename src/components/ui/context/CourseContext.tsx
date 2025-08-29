"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ChevronDown, CheckCircle, Play, Lock } from "lucide-react";
import CourseCertification from "@/components/certification/CourseCertification";
import { QuizModal, Quiz } from "../modals/QuizModal";
import axios from "axios";

export interface LessonsItem {
  id: string;
  title: string;
  type: "video" | "doc" | "quiz";
  duration?: string;
  durationSecs?: number;
  completed?: boolean;
  videoUrl?: string;
  quiz?: Quiz;
  isLocked?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: LessonsItem[];
}

interface CourseContextType {
  modules: Module[];
  currentLesson: LessonsItem | null;
  setCurrentLesson: (lesson: LessonsItem) => void;
  markLessonComplete: (
    lessonId: string,
    courseId: string,
    params: { secondsWatched: number; durationSecs: number }
  ) => Promise<void>;
  unlockNextLesson: (completedLessonId: string) => void;
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
  const processModulesWithLocking = (modules: Module[]): Module[] => {
    const allLessons: LessonsItem[] = [];
    modules.forEach((module) =>
      module.lessons.forEach((lesson) => allLessons.push(lesson))
    );

    let firstIncompleteFound = false;
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      if (i === 0) lesson.isLocked = false;
      else if (lesson.completed) lesson.isLocked = false;
      else if (!firstIncompleteFound && allLessons[i - 1]?.completed) {
        lesson.isLocked = false;
        firstIncompleteFound = true;
      } else lesson.isLocked = true;
    }

    return modules;
  };

  const [courseModules, setCourseModules] = useState<Module[]>(
    processModulesWithLocking(modules)
  );

  const findFirstAvailableLesson = (modules: Module[]): LessonsItem | null => {
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        if (!lesson.isLocked && lesson.type === "video") return lesson;
      }
    }
    return null;
  };

  const [currentLesson, setCurrentLesson] = useState<LessonsItem | null>(
    findFirstAvailableLesson(courseModules)
  );

  const markLessonComplete = async (
    lessonId: string,
    courseId: string,
    {
      secondsWatched,
      durationSecs,
    }: { secondsWatched: number; durationSecs: number }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No access token found");
      console.log(durationSecs);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/upgrade-progress/${lessonId}/${courseId}`,
        {
          secondsWatched,
          durationSecs, // ← use the one passed from video player
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update lesson as completed and unlock next
      setCourseModules((prevModules) =>
        processModulesWithLocking(
          prevModules.map((module) => ({
            ...module,
            lessons: module.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, completed: true } : lesson
            ),
          }))
        )
      );
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      throw error;
    }
  };

  const unlockNextLesson = () => {
    setCourseModules((prevModules) => processModulesWithLocking(prevModules));
  };

  return (
    <CourseContext.Provider
      value={{
        modules: courseModules,
        currentLesson,
        setCurrentLesson,
        markLessonComplete,
        unlockNextLesson,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// ----------------- Sidebar Component -----------------
interface CourseSidebarProps {
  modules: Module[];
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  modules,
}) => {
  const { setCurrentLesson } = useCourse();
  const [openModuleId, setOpenModuleId] = useState<string | null>(
    modules?.[0]?.id || null
  );
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const toggleModule = (id: string) => {
    setOpenModuleId((prev) => (prev === id ? null : id));
    setIsCertOpen(false);
  };

  const toggleCertification = () => {
    const willOpen = !isCertOpen;
    if (willOpen) setOpenModuleId(null);
    setIsCertOpen(willOpen);
  };

  const openQuiz = (quiz: Quiz | null) => {
    setCurrentQuiz(quiz);
    setQuizModalOpen(true);
  };

  const handleLessonClick = (lesson: LessonsItem) => {
    if (lesson.isLocked) return;

    if (lesson.type === "video") setCurrentLesson(lesson);
    else if (lesson.type === "quiz" && lesson.quiz) openQuiz(lesson.quiz);
  };

  console.log("Lesson >>>", modules)

  return (
    <div className="space-y-4">
      {modules.map((module, idx) => (
        <div
          key={module.id}
          className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => toggleModule(module.id)}
            className={`w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
              openModuleId === module.id ? "border-b border-[#E7E7E7]" : ""
            }`}
          >
            <h3 className="text-[16px] font-semibold text-gray-900 text-left">
              Module {idx + 1}: {module.title}
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
              {module.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className={`flex items-center p-4 border-b border-gray-100 last:border-b-0 ${
                    lesson.isLocked
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
                          : lesson.isLocked
                          ? "border-gray-300 bg-gray-100"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {lesson.completed && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                      {lesson.isLocked && !lesson.completed && (
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
                          lesson.isLocked ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {lesson.title}
                        {lesson.isLocked && (
                          <span className="ml-2 text-xs text-gray-400">
                            (Locked)
                          </span>
                        )}
                      </h4>
                      <p
                        className={`text-sm ${
                          lesson.isLocked ? "text-gray-400" : "text-gray-600"
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
                      {lesson.type === "quiz" &&
                        lesson.quiz &&
                        !lesson.isLocked && (
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
                      {lesson.type === "video" && !lesson.isLocked && (
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
                      {lesson.isLocked && (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Certification */}
      <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
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
        courseId={modules?.[0]?.id || ""}
      />
    </div>
  );
};

export default CourseContext;
