"use client";

import course_details_image from "@/assets/images/course_details_image.png";
import instructorImage from "@/assets/images/about_dp.png";
import CourseReviewAbout from "@/components/ui/review/CourseReviewAbout";
import Promotion from "@/components/shared/Promotion/Promotion";
import CourseContext, { Lesson } from "@/components/ui/context/CourseContext";
import { reviewData } from "@/utils/dummyData";
import CourseVideoPlayer from "@/components/ui/videoPlayer/CourseVideoPlayer";
import CourseDocs from "./CourseDocs";

interface CourseDetailsProps {
  course: {
    id?: number;
    title: string;
    type: string;
    description: string;
    instructor: string;
    rating: number;
    lessonsList: Lesson[];
  };
}

export default function CourseDetailsPage({ course }: CourseDetailsProps) {
  const instructor = {
    name: course.instructor,
    avatar: instructorImage,
  };

  const filteredReviews = reviewData.filter(
    (review) => review.courseId === course.id
  );

  const lessonsList = course.lessonsList;

  return (
    <div className="container">
      <section className="py-8 lg:py-12 mx-auto">
        <div className="grid lg:grid-cols-4 gap-12 items-start">
          <div className="lg:col-span-3">
            {course.type === "video" ? (
              <CourseVideoPlayer
                src="/videos/course-video.mp4"
                poster={course_details_image.src}
              />
            ) : (
              <>
                <CourseDocs />
              </>
            )}

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
                <h1 className="text-3xl md:text-4xl lg:text-[24px] font-bold text-gray-900 mb-[24px] font-playfairDisplay">
                  {course.title}
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
              </div>
            </div>
            <CourseReviewAbout
              description={course.description}
              instructor={instructor}
              reviews={filteredReviews}
            />
          </div>
          <div className="lg:col-span-1">
            <CourseContext lessonsList={lessonsList} />
          </div>
        </div>
      </section>
      <section className="pt-[80px]">
        <Promotion />
      </section>
    </div>
  );
}
