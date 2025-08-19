import { Star } from "lucide-react";
import Image from "next/image";
import course_image from "@/assets/images/course_image.png";
import { reviewData } from "@/utils/dummyData";

interface Course {
  id: string;
  title: string;
  lessons: number;
  duration: string;
  rating: number;
  type: string;
}

export default function CourseCard({ course }: { course: Course }) {
  const filteredReviews = reviewData.filter(
    (review) => review.courseId === course.id
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative flex items-center justify-center">
        <Image
          className="w-full h-full"
          src={course_image}
          alt="Course Image"
        />
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 font-playfairDisplay">
          {course.title}
        </h3>

        {/* Course Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-600">
              {course.lessons} Lessons, {course.duration}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-[#404040]">
              {course.rating} ({filteredReviews.length})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
