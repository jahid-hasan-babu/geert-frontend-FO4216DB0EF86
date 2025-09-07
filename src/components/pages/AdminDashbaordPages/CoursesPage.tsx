"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CourseCard from "@/components/ui/card/CourseCard";
import Pagination from "@/components/ui/pagination/Pagination";
import Link from "next/link";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { Skeleton } from "antd";

interface Course {
  id: string;
  title: string;
  slug: string;
  lessons: number;
  duration: string;
  rating: number;
  category: string;
  type: string;
  description: string;
  coverImage: string;
  isBestseller?: boolean;
  isMicroLearning?: boolean;
}

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isFetching } = useGetAllCoursesQuery({
    search: searchTerm,
    page: currentPage,
  });

  const courses: Course[] = data?.data?.data || [];
  const totalPages: number = data?.data?.meta?.totalPage || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto mb-6">
        {/* Header and Add Course Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-5xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Link href="/dashboard/course/add-course">
            <button className="bg-[#3399CC] hover:bg-[#0077CC] duration-300 text-white px-2 lg:px-4 py-[5px] lg:py-[10px] text-xs lg:text-sm rounded-full font-semibold transition-colors shadow-lg cursor-pointer font-sans">
              + Add Course
            </button>
          </Link>
        </div>

        {/* Courses Grid */}
        {isLoading || isFetching ? (
          <Skeleton active />
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No courses found. Try adjusting your search.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
