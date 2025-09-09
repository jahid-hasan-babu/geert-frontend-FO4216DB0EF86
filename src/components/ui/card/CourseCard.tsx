"use client";

import type React from "react";
import { LessonsItem } from "@/components/ui/context/CourseContext";
import { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import Image from "next/image";
import { Spin } from "antd";
import course_image from "@/assets/images/course_image.png";
import { reviewData } from "@/utils/dummyData";
import { toast } from "sonner";
import { useAddToFavoritesMutation } from "@/redux/features/favorites/favoritesApi";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  slug?: string;
  totalLessons?: number;
  duration: string;
  rating?: number;
  category?: string;
  type?: string;
  completed?: number;
  isBestseller?: boolean;
  isMicroLearning?: boolean;
  description?: string;
  coverImage?: string;
  lessons?: number;
  courseContexts?: LessonsItem[];
  isFavorite?: boolean; 
}

export default function CourseCard({
  course,
  isLoading = false,
}: {
  course: Course;
  isLoading?: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState<boolean>(
    course.isFavorite ?? false
  );

  const router = useRouter();
  const [addToFavorites, { isLoading: favLoading }] = useAddToFavoritesMutation();

  const filteredReviews = reviewData.filter(
    (review) => review.courseId === course.id
  );

  // ✅ Keep local state in sync if parent passes updated course object
  useEffect(() => {
    setIsFavorite(course.isFavorite ?? false);
  }, [course.isFavorite]);

  const toggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);

      await addToFavorites(course.id).unwrap();

      toast.success(
        newFavoriteState
          ? "Course added to favorites!"
          : "Course removed from favorites!"
      );
    } catch (error) {
      setIsFavorite(isFavorite);
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  console.log("Course", course)

  return (
    <div
      className="bg-white h-full rounded-2xl overflow-hidden duration-300 transition-shadow relative hover:shadow-lg cursor-pointer border-[1px] border-gray-200"
      onClick={() => router.push(`/dashboard/course/${course.id}`)}
    >
      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        disabled={favLoading || isLoading}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/70 hover:bg-white shadow-sm hover:scale-110 transition-transform z-10 cursor-pointer"
      >
        <Heart
          className={`w-6 h-6 ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {/* Course Image */}
      <div className="relative flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/70 z-10">
            <Spin size="large" />
          </div>
        )}
        <Image
          className="w-full h-[260px] object-cover"
          src={course.coverImage || course_image}
          width={100}
          height={100}
          alt={course.title || "Course Image"}
        />
      </div>

      {/* Course Details */}
      <div className="flex flex-col p-4 h-full space-y-4">
        <div className="flex text-2xl font-bold text-gray-900 font-playfairDisplay justify-between items-start">
          <div className="flex-1 truncate" data-translate>{course.title}</div>
          {course.isMicroLearning && (
            <div className="ml-2 mt-1 bg-[#3399CC] text-white py-1 px-2 rounded-full text-[10px] font-sans whitespace-nowrap self-start">
              Microlearning
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-600" data-translate>
              {course.totalLessons} Lessons, {course.duration}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-[#404040]">
              {course.rating ?? 0} ({filteredReviews.length})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
