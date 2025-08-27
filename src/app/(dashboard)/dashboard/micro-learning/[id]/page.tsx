import CourseDetails from "@/components/pages/AdminDashbaordPages/CourseDetailsPage";
import { courseData } from "@/utils/dummyData";
import { instructorsData } from "@/utils/dummyData";
import React from "react";

interface PageProps {
  params: { id: string };
}

const Page = ({ params }: PageProps) => {
  const course = courseData.find((c) => c.id === params.id);
  const instructor = instructorsData.find((i) =>
    i.assignedCoursesId.includes(params.id)
  );
  console.log("Instructor", instructor)

  if (!course) {
    return <div>Course not found</div>;
  }

  return <CourseDetails course={course} instructor={instructor} />;
};

export default Page;
