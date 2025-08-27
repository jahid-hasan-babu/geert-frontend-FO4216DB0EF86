import CourseDetailsPage from "@/components/pages/courseDetailsPage/courseDetailsPage";
import { courseData } from "@/utils/dummyData";
import { notFound } from "next/navigation";

interface CoursePageParams {
  slug: string;
}

export default async function CoursePage({ params }: { params: Promise<CoursePageParams> }) {
  const { slug } = await params;

  const course = courseData.find((c) => c.slug === slug);

  if (!course) {
    return notFound();
  }

  return <CourseDetailsPage course={course} />;
}
