"use client";

import { ChevronDown, CheckCircle, Play } from "lucide-react";
import React, { useState } from "react";

export type LessonItem =
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
  items: LessonItem[];
  isOpen?: boolean;
}

const CourseContext: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Lesson 1: Introduction",
      isOpen: true,
      items: [
        {
          id: "1-1",
          title: "What is UI Design?",
          type: "video",
          duration: "02:30 minutes",
          completed: false,
        },
        {
          id: "1-2",
          title: "The Role of a UI Designer",
          type: "video",
          duration: "03:30 minutes",
          completed: false,
        },
        {
          id: "1-3",
          title: "UI vs UX Key Differences",
          type: "video",
          duration: "04:30 minutes",
          completed: false,
        },
        {
          id: "1-4",
          title: "Quiz Exam",
          type: "quiz",
          description: "Mark the 4 quiz",
          completed: true,
        },
      ],
    },
    {
      id: "2",
      title: "Lesson 2: Design Foundations",
      isOpen: false,
      items: [],
    },
    {
      id: "3",
      title: "Lesson 3: Wireframing & Planning",
      isOpen: false,
      items: [],
    },
    {
      id: "4",
      title: "Lesson 4: Working with Figma",
      isOpen: false,
      items: [],
    },
    {
      id: "5",
      title: "Lesson 5: Design Systems",
      isOpen: false,
      items: [],
    },
    {
      id: "6",
      title: "Lesson 6: Real-World Projects",
      isOpen: false,
      items: [],
    },
    {
      id: "7",
      title: "Lesson 7: Prototyping & Handoff",
      isOpen: false,
      items: [],
    },
    {
      id: "8",
      title: "Lesson 8: Certification",
      isOpen: false,
      items: [],
    },
  ]);

  const toggleLesson = (lessonId: string) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) => ({
        ...lesson,
        isOpen: lesson.id === lessonId ? !lesson.isOpen : false,
      }))
    );
  };

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
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
              {lesson.title}
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
              {lesson.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
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
                    {index < lesson.items.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 mt-2" />
                    )}
                  </div>

                  <div className="flex-1 flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.type === "video"
                          ? `Video: ${item.duration}`
                          : item.description}
                      </p>
                    </div>

                    <button className="ml-4 p-2 rounded-full hover:bg-gray-200">
                      {item.type === "video" ? (
                        <Play className="w-5 h-5 text-gray-600" />
                      ) : item.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 border border-gray-400 rounded" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseContext;
