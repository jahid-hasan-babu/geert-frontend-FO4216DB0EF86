import React from "react";
import HelpSupport from "@/components/pages/helpSupport/HelpSupport";
import Promotion from "@/components/shared/Promotion/Promotion";
import Partners from "@/components/common/Partners";

const page = () => {
  return (
    <>
      <HelpSupport />
      <div className="mb-[80px]">
        <Partners />
      </div>
      <Promotion />
    </>
  );
};

export default page;
