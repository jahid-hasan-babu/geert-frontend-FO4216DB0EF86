import React from "react";
import Promotion from "@/components/shared/Promotion/Promotion";
import Partners from "@/components/common/Partners";
import RegulatoryInfo from "@/components/pages/RegulatoryInfo/RegulatoryInfo";

const page = () => {
  return (
    <>
      <RegulatoryInfo />
      <div className="mb-[80px]">
        <Partners />
      </div>
      <Promotion />
    </>
  );
};

export default page;
