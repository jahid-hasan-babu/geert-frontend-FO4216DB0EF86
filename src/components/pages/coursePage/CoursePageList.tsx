"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/ui/card/CourseCard";
import CourseFilter from "@/components/ui/filter/CourseFilter";
import Pagination from "@/components/ui/pagination/Pagination";
import CourseSearch from "@/components/ui/search/CourseSearch";
import Link from "next/link";
import axios from "axios";
import { LessonsItem } from "@/components/ui/context/CourseContext";

interface Category {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  courseContexts: LessonsItem[];
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

export default function CoursesPageList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const coursesPerPage = 9;
  const token = localStorage.getItem("token");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/category/all-category`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(res.data.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [token]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return;
      setLoading(true);

      try {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/courses/all-course`;
        const queryParams: string[] = [];

        // Determine search term: searchQuery or activeFilter
        let searchParam = searchQuery;
        if (activeFilter !== "All") {
          searchParam = activeFilter;
        }

        if (searchParam) queryParams.push(`search=${encodeURIComponent(searchParam)}`);

        // Pagination
        queryParams.push(`page=${currentPage}`);
        queryParams.push(`limit=${coursesPerPage}`);

        if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourses(res.data.data.data || []);
        setTotalPages(res.data.data.meta?.totalPage || 1);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, searchQuery, activeFilter, token]);

  return (
    <div className="container mx-auto px-3 lg:px-6 py-5 lg:py-[80px]">
      {/* Header */}
      <div className="text-center mb-12 lg:max-w-1/2 mx-auto">
        <h1 className="text-2xl md:text-5xl lg:text-[64px] font-semibold text-gray-900 mb-6 font-playfairDisplay">
          Start Learning Something Today
        </h1>
        <p className="text-lg text-gray-600">
          Explore high-quality courses that help you grow.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center my-[40px] gap-6">
        <CourseFilter
          filters={["All", ...categories.map((c) => c.name)]}
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

      {/* Courses List */}
      {loading ? (
        <p className="text-center text-gray-500 mb-3">Loading courses...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id}>
                <CourseCard course={course} />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No courses found.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {courses.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
}
