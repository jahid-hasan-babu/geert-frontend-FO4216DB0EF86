"use client";

import Image from "next/image";
import courseImage from "@/assets/images/course_details_image.png";
import instructorImage from "@/assets/images/about_dp.png";
import CourseReviewAbout from "@/components/ui/review/CourseReviewAbout";
import Promotion from "@/components/shared/Promotion/Promotion";
import CourseContext from "@/components/ui/context/CourseContext";
import { reviewData } from "@/utils/dummyData";

export default function CourseDetailsPage() {
  const courseDescription = "Master the art of modern UI design! In this hands-on course, you’ll learn the fundamentals of layout, color, typography, and design tools like Figma. Perfect for beginners looking to create clean, user-friendly interfaces for web and mobile.";

  const instructor = {
    name: "Alex Endean",
    avatar: instructorImage,
  };

  return (
    <div className="container">
      <section className="py-12 lg:py-16 mx-auto">
        <div className="grid lg:grid-cols-4 gap-12 items-start">
          <div className="col-span-3">
            <Image src={courseImage} className="w-full h-full" alt="Course" />
            <div className="flex col-span-3 justify-between py-6">
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
                    4.9 (250)
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-[24px] font-bold text-gray-900 mb-8 font-playfairDisplay">
                  UI Design Bootcamp: Build Beautiful Interfaces
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                {/* Stats */}
              </div>
            </div>
            <CourseReviewAbout
              description={courseDescription}
              instructor={instructor}
              reviews={reviewData}
            />
          </div>
          <div className="col-span-1">
            <CourseContext />
          </div>
        </div>
      </section>
      <section className="pt-[80px]">
        <Promotion />
      </section>
    </div>
  );
}
