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

  // Track real watched time, ignoring skips
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const delta = currentTime - lastTimeRef.current;

    // Only count continuous playback, ignore skips
    if (delta > 0 && delta <= 1) {
      setSecondsWatched(prev => prev + delta);
    }

    lastTimeRef.current = currentTime;
  };

  // Send watched progress to API on video end
  const handleVideoEnd = async () => {
    if (!currentLesson || !currentLesson.durationSecs) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/upgrade-progress/${currentLesson.id}/${courseId}`,
        {
          secondsWatched: Math.floor(secondsWatched), // real watched seconds
          durationSecs: currentLesson.durationSecs,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Progress updated ✅", Math.floor(secondsWatched));
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  // Reset seconds watched when lesson changes
  useEffect(() => {
    setSecondsWatched(0);
    lastTimeRef.current = 0;
  }, [currentLesson]);

  if (!currentLesson || currentLesson.type !== "video") {
    return (
      <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-50">
        No video selected
      </div>
    );
  }

  return (
    <div>
      <video
        ref={videoRef}
        src={currentLesson.videoUrl}
        controls
        className="w-full rounded-lg"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
      />
      {/* <p className="mt-2 text-sm text-gray-500">
        Watched: {Math.floor(secondsWatched)}s /{" "}
        {currentLesson.durationSecs ?? "?"}s
      </p> */}
    </div>
  );
};

export default CourseVideoPlayer;
