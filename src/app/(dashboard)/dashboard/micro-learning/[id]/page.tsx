
// import CourseDetails from "@/components/pages/AdminDashbaordPages/CourseDetailsPage";
import { courseData } from "@/utils/dummyData";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  
  const course = courseData.find((c) => c.id === id);



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