import React from "react";
import Promotion from "@/components/shared/Promotion/Promotion";
import Partners from "@/components/common/Partners";
import CookiesPolicy from "@/components/pages/cookiesPolicy/CookiesPolicy";

const page = () => {
  return (
    <>
      <CookiesPolicy />
      <div className="mb-[80px]">
        <Partners />
      </div>
      <Promotion />
    </>
  );
};

export default page;
