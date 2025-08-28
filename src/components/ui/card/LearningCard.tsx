/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import course_image from "@/assets/images/course_image.png";

interface Course {
  id: string;
  title: string;
  lessons: number;
  completed: number;
  progress: number;
  status: string;
  badge?: string;
  coverImage?: string;
  completedLessons: number;
  totalLessons: number;

}

export default function LearningCard({
  course,
  isLoading,
}: {
  course: Course;
  isLoading: boolean;
}) {
  console.log(course, "course data");
  const progress =
    course?.totalLessons > 0 ? Math.round((course?.completedLessons / course?.totalLessons) * 100) : 0;
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image with Quote Overlay */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3399CC]"></div>
          </div>
        )}
        <Image
          className="w-full h-48 object-cover"
          src={course?.coverImage ?? course_image}
          width={500}
          height={300}
          alt="Course Image"
        />
        <div className="absolute top-4 left-4 text-white text-4xl font-bold opacity-90">
          {"''"}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 font-playfairDisplay leading-tight">
            {course?.title}
          </h3>
          {course?.badge && (
            <span className="inline-block bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {course.badge}
            </span>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>
              {course.completedLessons}/{course.totalLessons} Lessons
            </span>
            <span>
              {course.totalLessons > 0
                ? Math.round(
                    (course.completedLessons / course.totalLessons) * 100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-400 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  course.totalLessons > 0
                    ? (course.completedLessons / course.totalLessons) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
