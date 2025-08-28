"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CourseCard from "@/components/ui/card/CourseCard";
import Pagination from "@/components/ui/pagination/Pagination";
import Link from "next/link";
import axios from "axios";

interface Course {
  id: string;
  title: string;
  slug: string;
  lessons: number;
  duration: string;
  rating: number;
  category: string;
  type: string;
  completed: number;
  isBestseller?: boolean;
  isMicroLearning?: boolean;
  description: string;
  coverImage: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const coursePerPage = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/all-course`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses(res?.data?.data?.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / coursePerPage);
  const startIndex = (currentPage - 1) * coursePerPage;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursePerPage
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-5xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Link href="/dashboard/course/add-course">
            <button className="bg-[#3399CC] text-white px-2 lg:px-4 py-[5px] lg:py-[10px] text-xs lg:text-sm rounded-full font-semibold transition-colors duration-200 shadow-lg cursor-pointer font-sans">
              + Add Course
            </button>
          </Link>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (

                <CourseCard key={course.id} course={course} />

            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default CoursesPage;
