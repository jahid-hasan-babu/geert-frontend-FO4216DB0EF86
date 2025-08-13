import React from "react";
import ContactForm from "@/components/pages/contactPage/ContactFrom";
import Partners from "@/components/common/Partners";
import Promotion from "@/components/shared/Promotion/Promotion";

const page = () => {
  return (
    <>
      <ContactForm />
      <div className="mb-[80px]">
        <Partners />
      </div>
      <Promotion />
    </>
  );
};

export default page;
