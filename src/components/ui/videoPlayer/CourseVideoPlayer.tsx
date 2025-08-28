"use client";

import React from "react";
import { useCourse } from "@/components/ui/context/CourseContext";

const CourseVideoPlayer: React.FC = () => {
  const { currentLesson } = useCourse();

  if (!currentLesson || currentLesson.type !== "video") {
    return (
      <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
        <p className="text-gray-500">Select a video lesson to start</p>
      </div>
    );
  }

  return (
    <video
      className="w-full h-auto rounded-lg shadow-md"
      controls
      preload="metadata"
      poster="/default-poster.png"
      key={currentLesson.id}
    >
      <source src={currentLesson.videoUrl} type="video/mp4" />
      Sorry, your browser does not support the video tag.
    </video>
  );
};

export default CourseVideoPlayer;
