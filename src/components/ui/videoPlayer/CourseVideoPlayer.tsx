import React from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

const CourseVideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, className }) => {
  return (
    <video
      className={`w-full h-auto rounded-lg shadow-md ${className ?? ""}`}
      controls
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
      Sorry, your browser does not support the video tag.
    </video>
  );
};

export default CourseVideoPlayer;
