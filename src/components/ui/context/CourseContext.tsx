"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import axios from "axios";
import { ChevronDown, CheckCircle, Play, Lock, FileText } from "lucide-react";
import CourseCertification from "@/components/certification/CourseCertification";
import { QuizModal, Quiz } from "../modals/QuizModal";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

// ---------------- Types ----------------
export interface LessonsItem {
  id: string;
  title: string;
  type: "video" | "doc" | "quiz";
  duration?: string;
  durationSecs?: number;
  completed?: boolean;
  videoUrl?: string;
  description?: string;
  quiz?: Quiz;
  locked: boolean;
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
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourse must be used within CourseProvider");
  return ctx;
};

// ---------------- Course Provider ----------------
export const CourseProvider: React.FC<{
  modules: Module[];
  children: ReactNode;
}> = ({ modules, children }) => {
  const initialLesson =
    modules
      .flatMap((m) => m.lessons)
      .find((l) => !l.locked && l.type === "video") ||
    modules.flatMap((m) => m.lessons).find((l) => !l.locked) ||
    null;

  const [currentLesson, setCurrentLesson] = useState<LessonsItem | null>(
    initialLesson
  );

  return (
    <CourseContext.Provider
      value={{ modules, currentLesson, setCurrentLesson }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// ---------------- Course Video/Doc Player ----------------
interface CourseVideoPlayerProps {
  courseId: string;
}

export const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({
  courseId,
}) => {
  const { currentLesson } = useCourse();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [secondsWatched, setSecondsWatched] = useState(0);
  const lastTimeRef = useRef(0);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const delta = currentTime - lastTimeRef.current;
    if (delta > 0 && delta <= 1) setSecondsWatched((prev) => prev + delta);
    lastTimeRef.current = currentTime;
  };

  const handleVideoEnd = async () => {
    if (!currentLesson || !currentLesson.durationSecs) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/upgrade-progress/${currentLesson.id}/${courseId}`,
        {
          secondsWatched: Math.floor(secondsWatched),
          durationSecs: currentLesson.durationSecs,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  useEffect(() => {
    setSecondsWatched(0);
    lastTimeRef.current = 0;
  }, [currentLesson]);

  if (!currentLesson) {
    return (
      <div
        className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100 text-gray-500"
        data-translate
      >
        No lesson selected
      </div>
    );
  }

  if (currentLesson.type === "video") {
    return (
      <div>
        <video
          key={currentLesson.id}
          ref={videoRef}
          src={currentLesson.videoUrl}
          controls
          className="w-full rounded-lg"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
        />
      </div>
    );
  }

  if (currentLesson.type === "doc") {
    return (
      <div className="w-full border rounded-lg bg-white shadow-sm p-6 prose max-w-none">
        <h2 className="text-xl font-semibold mb-4">{currentLesson.title}</h2>
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: currentLesson.description || "" }}
        />
      </div>
    );
  }

  if (currentLesson.type === "quiz") {
    return (
      <div
        className="w-full h-64 flex items-center justify-center border rounded-lg bg-yellow-50 p-4"
        data-translate
      >
        📝 Quiz: {currentLesson.title}
      </div>
    );
  }

  return null;
};

// ---------------- Course Sidebar ----------------
interface CourseSidebarProps {
  modules: Module[];
  courseId: string;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  modules,
  courseId,
}) => {
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

    if (lesson.type === "video" || lesson.type === "doc")
      setCurrentLesson(lesson);
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
              <span data-translate>Lesson</span> {idx + 1}: {module.title}
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
                    <TranslateInitializer />
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          lesson.completed
                            ? "bg-green-500 border-green-500"
                            : !isLocked
                            ? "bg-green-500"
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
                          data-translate
                        >
                          {lesson.title}
                          {isLocked && (
                            <span
                              className="ml-2 text-xs text-gray-400"
                              data-translate
                            >
                              (Locked)
                            </span>
                          )}
                        </h4>
                        <p
                          className={`text-sm ${
                            isLocked ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {lesson.type === "video" ? (
                            <>
                              <span data-translate>Video:</span>{" "}
                              {lesson.duration}
                            </>
                          ) : lesson.type === "doc" ? (
                            <span data-translate>Doc</span>
                          ) : lesson.type === "quiz" ? (
                            <span data-translate>Quiz</span>
                          ) : (
                            lesson.duration
                          )}
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
                            data-translate
                            title="Take Quiz"
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
                            title="Play Video"
                            data-translate
                          >
                            <Play className="w-5 h-5 text-gray-600" />
                          </button>
                        )}

                        {lesson.type === "doc" && !isLocked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentLesson(lesson);
                            }}
                            className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                            title="Open Doc"
                            data-translate
                          >
                            <FileText className="w-5 h-5 text-gray-600" />
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
          <h3
            data-translate
            className="text-[16px] font-semibold text-gray-900"
          >
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
          <CourseCertification courseId={courseId} />
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
