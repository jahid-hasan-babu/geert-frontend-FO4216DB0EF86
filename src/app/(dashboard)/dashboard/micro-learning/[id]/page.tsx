// import CourseDetails from "@/components/pages/AdminDashbaordPages/CourseDetailsPage";
import { courseData } from "@/utils/dummyData";
import { instructorsData } from "@/utils/dummyData";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  
  const course = courseData.find((c) => c.id === id);
  const instructor = instructorsData.find((i) =>
    i.assignedCoursesId.includes(id)
  );
  console.log("Instructor", instructor)

  if (!course) {
    return <div>Course not found</div>;
  }

  return
  
 <div>
working
   {/* <CourseDetails course={course} instructor={instructor} /> */}
 </div>
  
  ;
};

export default Page;