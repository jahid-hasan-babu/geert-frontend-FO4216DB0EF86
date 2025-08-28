"use client";

import { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import course_image from "@/assets/images/course_image.png";
import { reviewData } from "@/utils/dummyData";
import { toast } from "sonner";
import { useAddToFavoritesMutation } from "@/redux/features/favorites/favoritesApi";

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
  isFavorite?: boolean; // ✅ comes directly from API
} 

export default function CourseCard({ course }: { course: Course }) {
  const [isFavorite, setIsFavorite] = useState<boolean>(course.isFavorite ?? false);

  const [addToFavorites] = useAddToFavoritesMutation();

  const filteredReviews = reviewData.filter(
    (review) => review.courseId === course.id
  );

  // ✅ Keep local state in sync if parent passes updated course object
  useEffect(() => {
    setIsFavorite(course.isFavorite ?? false);
  }, [course.isFavorite]);

  const toggleFavorite = async () => {
   
  };

  return (
    <div className="bg-white h-full rounded-2xl overflow-hidden transition-shadow duration-300 relative">

      <button
        onClick={toggleFavorite}
        disabled={loading}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/70 hover:bg-white shadow-sm hover:scale-110 transition-transform z-10 cursor-pointer"
      >
        <Heart
          className={`w-6 h-6 ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {/* 📸 Course image */}
      <div className="relative flex items-center justify-center">
        <Image
          className="w-full h-full object-cover"
          src={course.coverImage || course_image}
          width={100}
          height={100}
          alt={course.title || "Course Image"}
        />
      </div>

      {/* 📄 Course details */}
      <div className="flex flex-col p-4 h-full space-y-4">
        <div className="flex text-2xl font-bold text-gray-900 font-playfairDisplay justify-between items-start">
          <div className="flex-1 truncate">{course.title}</div>
          {course.isMicroLearning && (
            <div className="ml-2 mt-1 bg-[#3399CC] text-white py-1 px-2 rounded-full text-[10px] font-sans whitespace-nowrap self-start">
              Microlearning
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-600">
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
