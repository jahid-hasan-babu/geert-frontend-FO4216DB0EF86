"use client";

import { useState, useEffect } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton/PrimaryButton";
import CourseCard from "@/components/ui/card/CourseCard";
import Link from "next/link";
import axios from "axios";

export default function HomeCourse() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/all-course`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(res.data.data.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <section className="pb-16 lg:pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 lg:mb-12">
          <h2 className="text-center lg:text-left text-3xl md:text-4xl lg:text-5xl text-gray-900 font-playfairDisplay font-semibold">
            Start Learning Something Today
          </h2>
          <div className="hidden md:block">
            <Link href="/courses">
              <PrimaryButton label="View All Course" />
            </Link>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-500">
              Loading courses...
            </div>
          ) : courses.length > 0 ? (
            courses.slice(0, 6).map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id}>
                <CourseCard
                  course={{
                    title: course.title,
                    slug: course.id,
                    coverImage: course.coverImage,
                    duration: course.duration,
                    price: course.price,
                    totalRaters: course.totalRaters,
                    avgRating: course.avgRating,
                    totalLessons: course.totalLessons,
                    isFavorite: course.isFavorite,
                  }}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No courses found
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <div className="mt-8 md:hidden">
          <PrimaryButton label="View All Course" className="w-full" />
        </div>
      </div>
    </section>
  );
}
