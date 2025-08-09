import Image from "next/image";
import course_image from "@/assets/images/course_image.png";

interface Course {
  id: number;
  title: string;
  lessons: number;
  completed: number;
  progress: number;
  status: string;
  badge?: string;
}

export default function LearningCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image with Quote Overlay */}
      <div className="relative">
        <Image
          className="w-full h-48 object-cover"
          src={course_image}
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
            {course.title}
          </h3>
          {course.badge && (
            <span className="inline-block bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {course.badge}
            </span>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>
              {course.completed}/{course.lessons} Lessons
            </span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
