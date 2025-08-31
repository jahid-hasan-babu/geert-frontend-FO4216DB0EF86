"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCourse } from "@/components/ui/context/CourseContext";
import axios from "axios";

interface CourseVideoPlayerProps {
  courseId: string;
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({ courseId }) => {
  const { currentLesson } = useCourse();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [secondsWatched, setSecondsWatched] = useState(0);
  const lastTimeRef = useRef(0);
  const [isDocCompleted, setIsDocCompleted] = useState(false);

  // Track watched time (video only)
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const delta = currentTime - lastTimeRef.current;

    if (delta > 0 && delta <= 1) {
      setSecondsWatched((prev) => prev + delta);
    }
    lastTimeRef.current = currentTime;
  };

  // Send progress for video
  const handleVideoEnd = async () => {
    if (!currentLesson || currentLesson.type !== "video") return;
    if (!currentLesson.durationSecs) return;

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

      console.log("Video progress updated ✅", Math.floor(secondsWatched));
    } catch (err) {
      console.error("Failed to update video progress:", err);
    }
  };

  // Complete doc lesson
  const handleDocComplete = async () => {
    if (!currentLesson || currentLesson.type !== "doc") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/upgrade-progress/${currentLesson.id}/${courseId}`,
        {
          secondsWatched: 0,        // For doc, always 0
          durationSecs: 0,          // For doc, always 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Doc marked as completed ✅");
      setIsDocCompleted(true);
    } catch (err) {
      console.error("Failed to mark doc as completed:", err);
    }
  };

  // Reset state when lesson changes
  useEffect(() => {
    setSecondsWatched(0);
    lastTimeRef.current = 0;
    setIsDocCompleted(false);
  }, [currentLesson]);

  // No lesson selected
  if (!currentLesson) {
    return (
      <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100 text-gray-500">
        No lesson selected
      </div>
    );
  }

  // Video lesson
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

  // Doc lesson
  if (currentLesson.type === "doc") {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border rounded-lg bg-gray-50 p-4">
        <p className="text-gray-700 mb-4">📄 Document: {currentLesson.title}</p>
        <button
          onClick={handleDocComplete}
          disabled={isDocCompleted}
          className={`px-6 py-2 rounded-full text-white font-medium transition ${
            isDocCompleted
              ? "bg-green-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isDocCompleted ? "Completed ✅" : "Mark as Completed"}
        </button>
      </div>
    );
  }

  // Quiz lesson
  if (currentLesson.type === "quiz") {
    return (
      <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-yellow-50 p-4">
        <p className="text-gray-700">📝 Quiz: {currentLesson.title}</p>
      </div>
    );
  }

  return null;
};

export default CourseVideoPlayer;
