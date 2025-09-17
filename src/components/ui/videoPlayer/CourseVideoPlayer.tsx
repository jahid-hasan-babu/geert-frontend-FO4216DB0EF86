"use client";

import React, { useRef, useState, useEffect } from "react";
import { useCourse } from "@/components/ui/context/CourseContext";
import axios from "axios";
import DOMPurify from "isomorphic-dompurify";
import { Spin } from "antd";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

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
  const [progressSubmitted, setProgressSubmitted] = useState(false);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const delta = currentTime - lastTimeRef.current;

    if (delta > 0 && delta <= 1) {
      setSecondsWatched((prev) => prev + delta);
    }
    lastTimeRef.current = currentTime;
  };

  const submitVideoProgress = async () => {
    if (!currentLesson || currentLesson.type !== "video" || progressSubmitted)
      return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const durationSecs = Math.floor(videoRef.current?.duration || 0);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/upgrade-progress/${currentLesson.id}/${courseId}`,
        {
          secondsWatched: Math.floor(secondsWatched),
          durationSecs,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Video progress updated ✅", Math.floor(secondsWatched));
      setProgressSubmitted(true);
      window.location.reload();
    } catch (err) {
      console.error("Failed to update video progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEnd = async () => {
    await submitVideoProgress();
  };

  // ✅ Auto-submit if 95% of video is watched
  useEffect(() => {
    if (
      videoRef.current &&
      currentLesson?.type === "video" &&
      !progressSubmitted
    ) {
      const duration = videoRef.current.duration;
      if (duration > 0 && secondsWatched >= duration * 0.95) {
        submitVideoProgress();
      }
    }
  }, [secondsWatched, currentLesson, progressSubmitted]);

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
    setProgressSubmitted(false);
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

  // Doc lesson - ENHANCED VERSION WITH PROPER STYLING
  if (currentLesson.type === "doc") {
    return (
      <div className="w-full flex flex-col items-center justify-start border rounded-lg bg-gray-50 p-6 max-h-[70vh] overflow-y-auto">
        <p className="text-gray-700 text-xl mb-4 font-semibold text-center sm:text-left">
          📄 Document: {currentLesson.title}
        </p>

        <div
          className="prose prose-lg max-w-none w-full 
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-0
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-3
            prose-h4:text-xl prose-h4:font-semibold prose-h4:mb-2
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:pl-2
            prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:pl-2
            prose-li:mb-2 prose-li:text-gray-700 prose-li:leading-relaxed
            prose-strong:font-bold prose-strong:text-gray-900
            prose-em:italic prose-em:text-gray-700
            prose-u:underline
            prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2
            [&_li]:mb-2 [&_li]:leading-relaxed
            [&_h1]:font-bold [&_h1]:text-4xl [&_h1]:mb-6 [&_h1]:text-gray-900
            [&_h1_span]:font-bold [&_h1_span]:text-inherit"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              // Fix H1 styling by adding CSS classes to H1 elements
              (currentLesson.description || "").replace(
                /<h1[^>]*>/g, 
                '<h1 style="font-weight: bold !important; font-size: 2.25rem !important; margin-bottom: 1.5rem !important; color: #111827 !important;">'
              ).replace(
                /<h1[^>]*><span[^>]*>/g,
                '<h1 style="font-weight: bold !important; font-size: 2.25rem !important; margin-bottom: 1.5rem !important; color: #111827 !important;"><span style="font-weight: bold !important; font-size: inherit !important; color: inherit !important;">'
              ),
              {
                ALLOWED_TAGS: [
                  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                  'p', 'br', 'strong', 'em', 'u', 'span', 'div',
                  'ol', 'ul', 'li',
                  'a', 'img',
                  'blockquote', 'code', 'pre',
                  'table', 'thead', 'tbody', 'tr', 'td', 'th'
                ],
                ALLOWED_ATTR: [
                  'style', 'color', 'class', 'data-translate',
                  'href', 'src', 'alt', 'title', 'target',
                  'font-family', 'font-size', 'font-weight',
                  'text-decoration', 'text-align'
                ],
                KEEP_CONTENT: true,
                ALLOW_DATA_ATTR: true
              }
            ),
          }}
        />

        <button
          onClick={handleDocComplete}
          disabled={isDocCompleted}
          className={`mt-6 px-6 py-2 rounded-full text-white font-medium transition cursor-pointer ${
            currentLesson?.completed
              ? "bg-green-400 cursor-not-allowed"
              : "bg-[#3399CC] hover:bg-[#52b9ec]"
          }`}
          data-translate
        >
          {currentLesson?.completed ? "Completed ✅" : "Mark as Completed"}
        </button>
      </div>
    );
  }

  // Quiz lesson - ENHANCED VERSION
  if (currentLesson?.type === "quiz") {
    return (
      <div className="w-full min-h-[16rem] flex flex-col items-center justify-center border rounded-lg bg-yellow-50 p-4 overflow-y-auto text-center sm:text-left">
        <TranslateInitializer />
        <p className="text-gray-700 mb-4">📝 Quiz: {currentLesson.title}</p>
        {currentLesson?.description && (
          <div
            className="prose prose-lg max-w-full text-gray-800
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4 prose-ol:pl-2
              prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-ul:pl-2
              prose-li:mb-2 prose-li:text-gray-700
              prose-strong:font-bold prose-strong:text-gray-900
              prose-em:italic
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2
              [&_li]:mb-2"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(currentLesson.description || "", {
                ALLOWED_TAGS: [
                  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                  'p', 'br', 'strong', 'em', 'u', 'span', 'div',
                  'ol', 'ul', 'li',
                  'a', 'img',
                  'blockquote', 'code', 'pre'
                ],
                ALLOWED_ATTR: [
                  'style', 'color', 'class', 'data-translate',
                  'href', 'src', 'alt', 'title',
                  'font-family', 'font-size', 'font-weight',
                  'text-decoration', 'text-align'
                ],
                KEEP_CONTENT: true,
                ALLOW_DATA_ATTR: true
              }),
            }}
          />
        )}
      </div>
    );
  }

  return null;
};

export default CourseVideoPlayer;