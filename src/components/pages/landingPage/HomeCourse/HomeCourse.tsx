import PrimaryButton from "@/components/ui/buttons/PrimaryButton/PrimaryButton";
import CourseCard from "@/components/ui/card/CourseCard";
import { courseData } from "@/utils/dummyData";
import Link from "next/link";

export default function HomeCourse() {
  return (
    <section className="pb-16 lg:pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 lg:mb-12">
          <h2 className="text-center lg:text-left text-3xl md:text-4xl lg:text-5xl text-gray-900 font-playfairDisplay font-semibold">
            Start Learning Something Today
          </h2>
          <div className="hidden md:block">
            <PrimaryButton label="View All Course" />
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courseData.map((course) => (
            <Link href={`/courses/${course.slug}`} key={course.id}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>

        {/* Mobile Button */}
        <div className="mt-8 md:hidden">
          <PrimaryButton label="View All Course" className="w-full" />
        </div>
      </div>
    </section>
  );
}
