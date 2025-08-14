"use client";

import { useState } from "react";
import CourseCard from "@/components/ui/card/CourseCard";
import CourseFilter from "@/components/ui/filter/CourseFilter";
import CoursePagination from "@/components/ui/pagination/CoursePagination";
import CourseSearch from "@/components/ui/search/CourseSearch";
import { courseCategoryData, courseData } from "@/utils/dummyData";
import Link from "next/link";

export default function CoursesPageList() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const coursesPerPage = 9;

  const filteredCourses = courseData.filter((course) => {
    const matchesFilter =
      activeFilter === "All" || course.category === activeFilter;
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursesPerPage
  );

  return (
    <div className="container mx-auto px-3 lg:px-6 py-5 lg:py-[80px]">
      <div className="text-center mb-12 lg:max-w-1/2 mx-auto">
        <h1 className="text-2xl md:text-5xl lg:text-[64px] font-semibold text-gray-900 mb-6 font-playfairDisplay">
          Start Learning Something Today
        </h1>
        <p className="text-lg text-gray-600">
          Explore high-quality courses that help you grow.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center my-[40px] gap-6">
        <CourseFilter
          filters={courseCategoryData}
          activeFilter={activeFilter}
          onChange={(f) => {
            setActiveFilter(f);
            setCurrentPage(1);
          }}
        />
        <CourseSearch
          value={searchQuery}
          onChange={(v) => {
            setSearchQuery(v);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {currentCourses.map((course) => (
          <Link href={`/courses/${course.slug}`} key={course.id}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>

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
