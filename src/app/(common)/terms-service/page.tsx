import React from "react";
import Promotion from "@/components/shared/Promotion/Promotion";
import Partners from "@/components/common/Partners";
import TermsService from "@/components/pages/termsService/TermsService";

const page = () => {
  return (
    <>
      <TermsService />
      <div className="mb-[80px]">
        <Partners />
      </div>
      <Promotion />
    </>
  );
};

export default page;
