import Image from "next/image";
import React from "react";
import brand_1 from "@/assets/images/Brand_01.png";
import brand_2 from "@/assets/images/Brand_02.png";
import brand_3 from "@/assets/images/Brand_03.png";
import brand_4 from "@/assets/images/Brand_04.png";
import brand_5 from "@/assets/images/Brand_05.png";
import brand_6 from "@/assets/images/Brand_06.png";

const Partners = () => {
  return (
    <>
      <div className="container flex flex-wrap items-center justify-center gap-6 md:justify-between w-full mt-10 lg:mt-auto">
        <Image src={brand_1} alt="brand_1" className="h-8 lg:h-auto w-auto" />
        <Image src={brand_2} alt="brand_2" className="h-8 lg:h-auto w-auto" />
        <Image src={brand_3} alt="brand_3" className="h-8 lg:h-auto w-auto" />
        <Image src={brand_4} alt="brand_4" className="h-8 lg:h-auto w-auto" />
        <Image src={brand_5} alt="brand_5" className="h-8 lg:h-auto w-auto" />
        <Image src={brand_6} alt="brand_6" className="h-8 lg:h-auto w-auto" />
      </div>
    </>
  );
};

export default Partners;
