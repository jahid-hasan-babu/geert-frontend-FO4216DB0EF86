import React from "react";
import Promotion from "@/components/shared/Promotion/Promotion";
import Partners from "@/components/common/Partners";
import PrivacyPolicy from "@/components/pages/privacyPolicy/PrivacyPolicy";

const page = () => {
  return (
    <>
      <PrivacyPolicy />
      <div className="mb-[80px]">
        <Partners />
      </div>
      <Promotion />
    </>
  );
};

export default page;
