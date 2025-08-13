"use client";

import CourseCertification from "@/components/certification/CourseCertification";
import { ChevronDown, CheckCircle, Play, Circle } from "lucide-react";
import React, { useState } from "react";

export type LessonsItem =
  | {
      id: string;
      title: string;
      type: "video";
      duration: string;
      completed?: boolean;
    }
  | {
      id: string;
      title: string;
      type: "quiz";
      description: string;
      completed?: boolean;
    };

export interface Lesson {
  id: string;
  title: string;
  items: LessonsItem[];
  isOpen?: boolean;
}

interface CourseContextProps {
  lessonsList: Lesson[];
}

const CourseContext: React.FC<CourseContextProps> = ({ lessonsList }) => {
  // State for lessons accordion open/close
  const [lessons, setLessons] = useState<Lesson[]>(() =>
    lessonsList.map((lesson, idx) => ({
      ...lesson,
      isOpen: idx === 0,
    }))
  );

  // State for Certification toggle
  const [isCertOpen, setIsCertOpen] = useState(false);

  const toggleLesson = (lessonId: string) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) => ({
        ...lesson,
        isOpen: lesson.id === lessonId ? !lesson.isOpen : false,
      }))
    );
    // Close certification if any lesson toggled open
    setIsCertOpen(false);
  };

  const toggleCertification = () => {
    // Close all lessons when cert opens
    const willOpen = !isCertOpen;
    if (willOpen) {
      setLessons((prevLessons) =>
        prevLessons.map((lesson) => ({ ...lesson, isOpen: false }))
      );
    }
    setIsCertOpen(willOpen);
  };

  return (
    <div className="space-y-4">
      {/* Lessons List */}
      {lessons.map((lesson, index) => (
        <div
          key={lesson.id}
          className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => toggleLesson(lesson.id)}
            className={`w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
              lesson.isOpen ? "border-b border-[#E7E7E7]" : ""
            }`}
          >
            <h3 className="text-[16px] font-semibold text-gray-900 text-left">
              Lesson {index + 1}: {lesson.title}
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 transform ${
                lesson.isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              lesson.isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white">
              {lesson.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  {/* Left line & status circle */}
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        item.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {item.completed && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    {idx < lesson.items.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Lesson text */}
                  <div className="flex-1 flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">
                        {item.type === "video"
                          ? `Video: ${item.duration}`
                          : item.description}
                      </p>
                    </div>

                    {/* Action button */}
                    <button className="ml-4 p-2 rounded-full hover:bg-gray-200">
                      {item.type === "video" ? (
                        <Play className="w-5 h-5 text-gray-600" />
                      ) : item.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div
        className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
        key="certification"
      >
        <button
          onClick={toggleCertification}
          className={`w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
            isCertOpen ? "border-b border-[#E7E7E7]" : ""
          }`}
        >
          <h3 className="text-[16px] font-semibold text-gray-900 ">
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
          <CourseCertification />
        </div>
      </div>
    </div>
  );
};

export default CourseContext;
