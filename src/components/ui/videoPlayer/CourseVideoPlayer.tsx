"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCourse } from "@/components/ui/context/CourseContext";
import { useParams } from "next/navigation"; // ✅ import hook

const CourseVideoPlayer: React.FC = () => {
  const { currentLesson, markLessonComplete } = useCourse();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasWatchedEnough, setHasWatchedEnough] = useState(false);
  const [totalWatchedTime, setTotalWatchedTime] = useState(0);
  const watchedSegments = useRef<Set<number>>(new Set());

  const params = useParams();
  const courseId = params?.slug;
  console.log("Course Id", courseId);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !currentLesson) return;

    const currentTime = Math.floor(video.currentTime);
    if (!watchedSegments.current.has(currentTime)) {
      watchedSegments.current.add(currentTime);
      setTotalWatchedTime(watchedSegments.current.size);
    }

    const progress = (video.currentTime / video.duration) * 100;
    if (progress >= 80 && !hasWatchedEnough && !currentLesson.completed) {
      setHasWatchedEnough(true);
    }
  };

  const handleVideoEnd = async () => {
    if (!currentLesson || currentLesson.completed || isCompleting) return;

    const secondsWatched = watchedSegments.current.size;
    const durationSecs =
      currentLesson.durationSecs ?? Math.floor(videoRef.current?.duration || 0);

    console.log("📊 Video Ended", { secondsWatched, durationSecs, courseId });

    try {
      setIsCompleting(true);
      await markLessonComplete(currentLesson.id, courseId as string, {
        secondsWatched,
        durationSecs,
      });
      console.log(`Lesson ${currentLesson.id} completed.`);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleManualComplete = async () => {
    if (!currentLesson || currentLesson.completed || isCompleting) return;

    const secondsWatched = watchedSegments.current.size;
    const durationSecs =
      currentLesson.durationSecs ?? Math.floor(videoRef.current?.duration || 0);

    console.log("📊 Manual Complete", {
      secondsWatched,
      durationSecs,
      courseId,
    });

    try {
      setIsCompleting(true);
      await markLessonComplete(currentLesson.id, courseId as string, {
        secondsWatched,
        durationSecs,
      });
      console.log(`Lesson ${currentLesson.id} manually completed.`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCompleting(false);
    }
  };

  useEffect(() => {
    setHasWatchedEnough(false);
    setIsCompleting(false);
    setTotalWatchedTime(0);
    watchedSegments.current = new Set();
  }, [currentLesson?.id]);

  if (!currentLesson || currentLesson.type !== "video") {
    return (
      <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
        <p className="text-gray-500">Select a video lesson to start</p>
      </div>
    );
  }

  const watchPercentage = currentLesson.durationSecs
    ? (totalWatchedTime / currentLesson.durationSecs) * 100
    : 0;

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        className="w-full h-[50vh] rounded-lg shadow-md"
        controls
        preload="metadata"
        poster="/default-poster.png"
        key={currentLesson.id}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
      >
        <source src={currentLesson.videoUrl} type="video/mp4" />
        Sorry, your browser does not support the video tag.
      </video>

      {/* Progress UI stays same */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Watch Progress
          </span>
          <span className="text-sm text-gray-600">
            {totalWatchedTime}s / {currentLesson.durationSecs || 0}s watched
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(watchPercentage, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {watchPercentage.toFixed(1)}% of content watched
        </span>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              currentLesson.completed ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              currentLesson.completed ? "text-green-700" : "text-gray-600"
            }`}
          >
            {currentLesson.completed ? "Completed" : "In Progress"}
          </span>
        </div>

        {hasWatchedEnough && !currentLesson.completed && (
          <button
            onClick={handleManualComplete}
            disabled={isCompleting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleting ? "Completing..." : "Mark as Complete"}
          </button>
        )}

        {isCompleting && (
          <span className="text-sm text-blue-600 font-medium">
            Marking lesson as complete...
          </span>
        )}
      </div>
    </div>
  );
};

export default CourseVideoPlayer;
