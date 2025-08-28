import CourseDetailsPage from "@/components/pages/courseDetailsPage/courseDetailsPage";

interface CoursePageParams {
  slug: string;
}

export default async function CoursePage({
  params,
}: {
  params: Promise<CoursePageParams>;
}) {
  const { slug } = await params;

  return <CourseDetailsPage slug={slug} />;
}
