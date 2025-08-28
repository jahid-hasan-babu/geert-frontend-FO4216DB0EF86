"use client";

import React, { useEffect, useState } from "react";
import instructorImage from "@/assets/images/about_dp.png";
import CourseReviewAbout from "@/components/ui/review/CourseReviewAbout";
import Promotion from "@/components/shared/Promotion/Promotion";
import CourseVideoPlayer from "@/components/ui/videoPlayer/CourseVideoPlayer";
import {
  CourseProvider,
  CourseSidebar,
  Module,
} from "@/components/ui/context/CourseContext";
import { reviewData } from "@/utils/dummyData";
import axios, { AxiosError } from "axios";

interface Instructor {
  name: string;
  avatar: string;
}

interface ModuleFromAPI {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    type?: "video" | "doc" | "quiz";
    duration?: string;
    completed?: boolean;
    videoUrl?: string;
  }[];
}

interface CourseFromAPI {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  rating: number;
  isMicroLearning?: boolean;
  instructorName?: string;
  modules?: ModuleFromAPI[];
}

interface CourseDetailsPageProps {
  slug: string;
}

export default function CourseDetailsPage({ slug }: CourseDetailsPageProps) {
  const [course, setCourse] = useState<CourseFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No access token found");

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/single-course/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Data >>> ", data?.data);

        setCourse(data?.data);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error(error);
        setError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  console.log("Courses >>>", course);

  if (loading) return <p className="text-center py-10">Loading course...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!course) return <p className="text-center py-10">Course not found</p>;

  const instructor: Instructor = {
    name: course.instructorName || "Instructor",
    avatar: instructorImage.src,
  };

  const filteredReviews = reviewData.filter(
    (review) => review.courseId === (course._id || course.id)
  );

  const modules: Module[] =
    course.modules?.map((m) => {
      // map lessons first
      const lessons = m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        duration: l.duration,
        completed: l.completed,
        videoUrl: l.videoUrl,
      }));

      // append quizzes if any
      if (m.Quiz?.length) {
        m.Quiz.forEach((q) => {
          lessons.push({
            id: q.id,
            title: q.title,
            type: "quiz",
            quiz: q,
          });
        });
      }

      return {
        id: m.id,
        title: m.title,
        lessons,
      };
    }) || [];

  console.log("Modules", modules);

  return (
    <CourseProvider modules={modules}>
      <div className="container">
        <section className="py-8 lg:py-12 mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 items-start">
            {/* Left: Video + Course Info */}
            <div className="lg:col-span-3 space-y-6">
              <CourseVideoPlayer />

              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.round(course.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-700 font-medium text-[14px]">
                      {course.rating} ({filteredReviews.length})
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

              <CourseReviewAbout
                description={course.description}
                instructor={instructor}
                reviews={filteredReviews}
              />
            </div>

            <div className="lg:col-span-1">
              <CourseSidebar modules={modules} />
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
