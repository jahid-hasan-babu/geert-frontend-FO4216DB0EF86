"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { courseData } from "@/utils/dummyData";
import CourseCard from "@/components/ui/card/CourseCard";
import Pagination from "@/components/ui/pagination/Pagination";
import Link from "next/link";

const MicroLearningPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursePerPage = 9;

  const filteredCourses = courseData
    .filter((course) => course.isMicroLearning)
    .filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredCourses.length / coursePerPage);
  const startIndex = (currentPage - 1) * coursePerPage;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursePerPage
  );

  return (
    <>
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
            <Link href="/dashboard/micro-learning/add-microLearning">
              <button className="bg-[#3399CC] text-white px-2 lg:px-4 py-[5px] lg:py-[10px] text-xs lg:text-sm rounded-full font-semibold transition-colors duration-200 shadow-lg cursor-pointer font-sans">
                {" "}
                + Add Microlearning
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <Link href={`/dashboard/micro-learning/${course.id}`} key={course.id}>
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default MicroLearningPage;
