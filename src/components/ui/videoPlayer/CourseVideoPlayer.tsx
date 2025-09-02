"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCourse } from "@/components/ui/context/CourseContext";
import axios from "axios";
import DOMPurify from "isomorphic-dompurify";
import { Spin } from "antd";

interface CourseVideoPlayerProps {
  courseId: string;
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({ courseId }) => {
  const { currentLesson } = useCourse();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [secondsWatched, setSecondsWatched] = useState(0);
  const lastTimeRef = useRef(0);
  const [isDocCompleted, setIsDocCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const delta = currentTime - lastTimeRef.current;

    if (delta > 0 && delta <= 1) {
      setSecondsWatched((prev) => prev + delta);
    }
    lastTimeRef.current = currentTime;
  };

  const handleVideoEnd = async () => {
    if (!currentLesson || currentLesson.type !== "video") return;
    if (!currentLesson.durationSecs) return;

    try {
      setLoading(true);
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
      window.location.reload();
    } catch (err) {
      console.error("Failed to update video progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocComplete = async () => {
    if (!currentLesson || currentLesson.type !== "doc") return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/upgrade-progress/${currentLesson.id}/${courseId}`,
        { secondsWatched: 0, durationSecs: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Doc marked as completed ✅");
      setIsDocCompleted(true);
      window.location.reload();
    } catch (err) {
      console.error("Failed to mark doc as completed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSecondsWatched(0);
    lastTimeRef.current = 0;
    setIsDocCompleted(false);
    setLoading(false);
  }, [currentLesson]);

  if (!currentLesson) {
    return (
      <div className="w-full min-h-[16rem] flex items-center justify-center border rounded-lg bg-gray-100 text-gray-500 p-4 text-center">
        To continue, please purchase this course! Contact Admin.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-[16rem] flex items-center justify-center">
        <Spin size="large" tip="Submitting..." />
      </div>
    );
  }

  // Video lesson
  if (currentLesson.type === "video") {
    return (
      <div className="w-full rounded-lg overflow-hidden bg-black aspect-video md:h-[60vh]">
        <video
          key={currentLesson.id}
          ref={videoRef}
          src={currentLesson.videoUrl}
          controls
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
        />
      </div>
    );
  }

  // Doc lesson
  if (currentLesson.type === "doc") {
    return (
      <div className="w-full flex flex-col items-center justify-start border rounded-lg bg-gray-50 p-4 max-h-[70vh] overflow-y-auto">
        <p className="text-gray-700 text-xl mb-4 font-semibold text-center sm:text-left">
          📄 Document: {currentLesson.title}
        </p>

        <div
          className="prose max-w-full text-gray-800 mb-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(currentLesson.description || ""),
          }}
        />

        <button
          onClick={handleDocComplete}
          disabled={isDocCompleted}
          className={`px-6 py-2 rounded-full text-white font-medium transition cursor-pointer ${
            isDocCompleted
              ? "bg-green-400 cursor-not-allowed"
              : "bg-[#3399CC] hover:bg-[#52b9ec]"
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
      <div className="w-full min-h-[16rem] flex flex-col items-center justify-center border rounded-lg bg-yellow-50 p-4 overflow-y-auto text-center sm:text-left">
        <p className="text-gray-700 mb-4">📝 Quiz: {currentLesson.title}</p>
        {currentLesson.description && (
          <div
            className="prose max-w-full text-gray-800"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(currentLesson.description),
            }}
          />
        )}
      </div>
    );
  }

  return null;
};

export default CourseVideoPlayer;
