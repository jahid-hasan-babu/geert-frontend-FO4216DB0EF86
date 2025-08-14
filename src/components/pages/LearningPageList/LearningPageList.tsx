"use client";

import { useState } from "react";
import LearningCard from "@/components/ui/card/LearningCard";
import CourseFilter from "@/components/ui/filter/CourseFilter";
import CoursePagination from "@/components/ui/pagination/CoursePagination";
import Link from "next/link";
import { courseData } from "@/utils/dummyData";

export default function LearningPageList() {
  const [activeFilter, setActiveFilter] = useState("Ongoing");
  const [currentPage, setCurrentPage] = useState(1);

  const filters = ["Ongoing", "Complete"];

  const allCourses = courseData.map((course) => {
    const progress = Math.round((course.completed / course.lessons) * 100);
    const status = course.completed === course.lessons ? "Complete" : "Ongoing";
    return { ...course, progress, status };
  });

  const coursesPerPage = 9;
  const filteredCourses = allCourses.filter(
    (course) => course.status === activeFilter
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursesPerPage
  );

  return (
    <div className="container mx-auto px-6 lg:pb-[80px]">
      {/* Header */}
      <div className="text-center mb-3 lg:mb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-playfairDisplay">
          My Learning
        </h1>
        <p className="text-sm lg:text-lg text-gray-600">
          Access all your courses, track progress, and unlock new skills in one
          place.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-col lg:flex-row justify-center items-center my-[20px] lg:my-[40px] gap-6">
        <CourseFilter
          filters={filters}
          activeFilter={activeFilter}
          onChange={(f) => {
            setActiveFilter(f);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {currentCourses.map((course) => (
          <>
            <Link href={`/courses/${course.slug}`} key={course.id}>
              <LearningCard course={course} />
            </Link>
          </>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CoursePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
}
