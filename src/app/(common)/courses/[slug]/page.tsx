import CourseDetailsPage from "@/components/pages/courseDetailsPage/courseDetailsPage";
import { courseData } from "@/utils/dummyData";
import { notFound } from "next/navigation";
import React from "react";

interface CoursePageProps {
  params: { slug: string };
}

const CoursePage = ({ params }: CoursePageProps) => {
  const { slug } = params;

  const course = courseData.find((c) => c.slug === slug);
  console.log(course?.type)

  if (!course) {
    return notFound();
  }

  return <CourseDetailsPage course={course} />;
};

export default CoursePage;
