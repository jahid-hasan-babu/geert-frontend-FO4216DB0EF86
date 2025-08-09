import PrimaryButton from "@/components/ui/buttons/PrimaryButton/PrimaryButton";
import CourseCard from "@/components/ui/card/CourseCard";
import { courseData } from "@/utils/dummyData";
import Link from "next/link";

export default function HomeCourse() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 font-playfairDisplay font-semibold">
            Start Learning Something Today
          </h2>
          <PrimaryButton label="View All Course" />
        </div>

        {/* Mobile Button */}
        <div className="mb-8 md:hidden">
          <PrimaryButton label="View All Course" />
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courseData.map((course) => (
            <Link href={`/courses/${course.slug}`} key={course.id}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
