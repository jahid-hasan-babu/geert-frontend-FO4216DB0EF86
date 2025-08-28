/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Link from "next/link"
import { useGetMyCoursesQuery } from "@/redux/features/courses/coursesApi"
import CourseFilter from "@/components/ui/filter/CourseFilter"
import LearningCard from "@/components/ui/card/LearningCard"
import Pagination from "@/components/ui/pagination/Pagination"

export default function LearningPageList() {
  const [activeFilter, setActiveFilter] = useState("inprogress")
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error } = useGetMyCoursesQuery(activeFilter)

  const filters = ["inprogress", "completed"]
  const coursesPerPage = 9

  const courses = data?.data?.data || []
  const meta = data?.data?.meta 


  const totalPages = meta?.totalPages 
  const startIndex = (currentPage - 1) * coursesPerPage
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage)


  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 lg:pb-[80px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3399CC] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 lg:pb-[80px]">
        <div className="text-center">
          <p className="text-red-600">Error loading courses. Please try again.</p>
        </div>
      </div>
    )
  }
  

  return (
    <div className="container mx-auto px-6 lg:pb-[80px]">
      <div className="text-center mb-3 lg:mb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-playfairDisplay">
          My Learning
        </h1>
        <p className="text-sm lg:text-lg text-gray-600">
          Access all your courses, track progress, and unlock new skills in one place.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center my-[20px] lg:my-[40px] gap-6">
        <CourseFilter filters={filters} activeFilter={activeFilter} onChange={handleFilterChange} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {currentCourses.length > 0 ? (
          currentCourses.map((course: any) => (
            <Link href={`/courses/${course.slug || course.id}`} key={course.id}>
              <LearningCard course={course} isLoading={isLoading} />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No courses found for the selected filter.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />}
    </div>
  )
}