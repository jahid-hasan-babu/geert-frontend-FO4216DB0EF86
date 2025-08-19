import React from "react";
import InstructorCourses from "@/components/pages/AdminDashbaordPages/InstructorCourses";
import { instructorsData } from "@/utils/dummyData";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const instructorId = params.id;
  const instructor = instructorsData.find((inst) => inst.id === instructorId);

  if (!instructor) {
    return <p>Instructor not found</p>;
  }

  return (
    <>
      <InstructorCourses instructor={instructor} />
    </>
  );
};

export default Page;
