"use client";

import { useEffect, useState } from "react";
import course_details_image from "@/assets/images/course_details_image.png";
import instructorImage from "@/assets/images/about_dp.png";
import CourseReviewAbout from "@/components/ui/review/CourseReviewAbout";
import Promotion from "@/components/shared/Promotion/Promotion";
import CourseContext, {
  LessonsItem,
} from "@/components/ui/context/CourseContext";
import { reviewData } from "@/utils/dummyData";
import CourseVideoPlayer from "@/components/ui/videoPlayer/CourseVideoPlayer";
import { Quiz } from "@/components/ui/modals/QuizModal";
import { StaticImageData } from "next/image";
import { AxiosError } from "axios";

interface Instructor {
  name: string;
  avatar: StaticImageData;
}

interface ModuleFromAPI {
  id: string;
  title: string;
  lessons: LessonsItem[];
  Quiz?: Quiz[];
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

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/single-course/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch course");

        const data = await res.json();
        setCourse(data?.data);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error(error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) return <p className="text-center py-10">Loading course...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!course) return <p className="text-center py-10">Course not found</p>;

  const instructor: Instructor = {
    name: course.instructorName || "Instructor",
    avatar: instructorImage,
  };

  const filteredReviews = reviewData.filter(
    (review) => review.courseId === (course._id || course.id)
  );

  return (
    <div className="container">
      <section className="py-8 lg:py-12 mx-auto">
        <div className="grid lg:grid-cols-4 gap-12 items-start">
          {/* Left / Main Content */}
          <div className="lg:col-span-3">
            <CourseVideoPlayer
              src="/videos/course-video.mp4"
              poster={course_details_image.src}
            />

            {/* Title & Rating */}
            <div className="flex col-span-3 justify-between pt-5">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
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

            {/* Description, Instructor, Reviews */}
            <CourseReviewAbout
              description={course.description}
              instructor={instructor}
              reviews={filteredReviews}
            />
          </div>

          {/* Right / Sidebar: Lessons + Quiz */}
          <div className="lg:col-span-1">
            <CourseContext modules={course.modules || []} />
          </div>
        </div>
      </section>

      <section className="pt-[80px]">
        <Promotion />
      </section>
    </div>
  );
}
