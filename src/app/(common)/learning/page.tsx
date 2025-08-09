import React from "react";
import LearningPageList from "@/components/pages/LearningPageList/LearningPageList";
import Promotion from "@/components/shared/Promotion/Promotion";
import Partners from "@/components/common/Partners";

const CoursePage = () => {
  return (
    <>
      <LearningPageList />
      <Partners />
      <div className="mt-[80px]">
        <Promotion />
      </div>
    </>
  );
};

export default CoursePage;
