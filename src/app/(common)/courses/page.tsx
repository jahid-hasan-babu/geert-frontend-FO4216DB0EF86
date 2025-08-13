import React from "react";
import CoursesPageList from "@/components/pages/coursePage/CoursePageList";
import Promotion from "@/components/shared/Promotion/Promotion";
import Partners from "@/components/common/Partners";

const CoursePage = () => {

  return (
    <>
      <CoursesPageList />
      <Partners />
      <div className="mt-[80px]">
        <Promotion />
      </div>
    </>
  );
};

export default CoursePage;
