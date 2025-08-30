"use client";

import React, { useEffect, useState } from "react";
import CourseReviewAbout from "@/components/ui/review/CourseReviewAbout";
import Promotion from "@/components/shared/Promotion/Promotion";
import CourseVideoPlayer from "@/components/ui/videoPlayer/CourseVideoPlayer";
import {
  CourseProvider,
  CourseSidebar,
  Module,
  LessonsItem,
} from "@/components/ui/context/CourseContext";
import axios, { AxiosError } from "axios";

// ---------------- Types ----------------
export interface Instructor {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  role: "INSTRUCTOR" | "STUDENT" | "ADMIN";
  phone: string | null;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
}

interface LessonFromAPI {
  id: string;
  title: string;
  type?: "video" | "doc" | "quiz";
  duration?: string;
  durationSecs?: number;
  completed?: boolean;
  videoUrl?: string;
  quiz?: QuizFromAPI;
  locked?: boolean;
}

export type QuizQuestion = {
  id: string;
  text: string;
  type: "SINGLE_CHOICE" | "MULTI_CHOICE" | "ORDERING" | "SCALE" | "TEXT";
  options: QuizOption[];
};

export type QuizOption = {
  id: string;
  text: string;
  questionId: string;
  value?: string;
};

interface QuizFromAPI {
  id: string;
  title: string;
  questions?: QuizQuestion[];
  locked?: boolean;
}

interface ModuleFromAPI {
  id: string;
  title: string;
  lessons: LessonFromAPI[];
  Quiz?: QuizFromAPI[];
  locked?: boolean;
}

interface CourseFromAPI {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  rating: number;
  isMicroLearning?: boolean;
  instructor?: Instructor;
  modules?: ModuleFromAPI[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    coverImage: string;
    avgRating: number;
    totalRaters: number;
  };
}

interface CourseDetailsPageProps {
  slug: string;
}

export default function CourseDetailsPage({ slug }: CourseDetailsPageProps) {
  const [course, setCourse] = useState<CourseFromAPI | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No access token found");

        const { data } = await axios.get<{ data: CourseFromAPI }>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/single-course/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCourse(data.data);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error(error);
        setError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [slug]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!course) return;

      try {
        setLoadingReviews(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get<{ data: Review[] }>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/my-reviews`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const courseId = course._id || course.id || "";
        const filtered = data.data.filter((r) => r.course.id === courseId);
        setReviews(filtered);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [course]);

  if (loadingCourse) return <p className="text-center py-10">Loading course...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!course) return <p className="text-center py-10">Course not found</p>;
  if (!course.instructor) return <p className="text-center py-10">Instructor not found</p>;

  const courseId = course._id || course.id || "";

  // ---------------- Modules Mapping ----------------
  const modules: Module[] =
    course.modules?.map((m) => {
      const lessons: LessonsItem[] = m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type || "doc",
        duration: l.duration,
        durationSecs: l.durationSecs,
        completed: l.completed,
        videoUrl: l.videoUrl,
        locked: l.locked ?? false,
        quiz: undefined,
      }));

      const quizLessons: LessonsItem[] = (m.Quiz ?? []).map((q) => ({
        id: q.id,
        title: q.title,
        type: "quiz",
        locked: q?.locked ?? true,
        quiz: {
          id: q.id,
          title: q.title,
          questions: q.questions ?? [],
          locked: q?.locked ?? true,
        },
      }));

      return {
        id: m.id,
        title: m.title,
        locked: m.locked ?? false,
        lessons: [...lessons, ...quizLessons],
      };
    }) || [];

  return (
    <CourseProvider modules={modules}>
      <div className="container">
        <section className="py-8 lg:py-12 mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 items-start">
            <div className="lg:col-span-3 space-y-6">
              <CourseVideoPlayer courseId={courseId} />

              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-700 font-medium text-[14px]">
                      {course.rating} ({reviews.length})
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <h1 className="text-3xl md:text-4xl lg:text-[24px] font-bold text-gray-900 font-playfairDisplay">
                      {course.title}
                    </h1>
                    {course.isMicroLearning && (
                      <span className="bg-[#3399CC] text-white py-1 px-2 rounded-full text-[10px]">
                        Microlearning
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {loadingReviews ? (
                <p className="text-center py-4">Loading reviews...</p>
              ) : (
                <CourseReviewAbout
                  description={course.description}
                  instructor={course.instructor}
                  reviews={reviews.map((r) => ({
                    id: r.id,
                    text: r.comment,
                    rating: r.rating,
                    date: new Date(r.createdAt).toLocaleDateString(),
                    author: "You",
                  }))}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <CourseSidebar modules={modules} courseId={courseId} />
            </div>
          </div>
        </section>

        <section className="pt-[80px]">
          <Promotion />
        </section>
      </div>
    </CourseProvider>
  );
}
