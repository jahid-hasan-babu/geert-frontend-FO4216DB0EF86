import Image from "next/image";
import React from "react";
import need_learning from "@/assets/images/need_learning.png";
import need_access from "@/assets/images/need_access.png";
import need_pricing from "@/assets/images/need_pricing.png";

const Need = () => {
  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 w-1/2 mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 font-playfairDisplay">
              Everything You Need to Succeed in One Platform
            </h2>
            <p className="text-lg md:text-[18px] text-gray-600 leading-relaxed w-[65%] mx-auto">
              Top-quality courses, expert mentors, and lifetime access. Learn at
              your own pace and turn knowledge into action.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-x-[30px]">
            <div className="text-center space-y-6 bg-[#EAF7FD80] py-[44px]">
              <div className="flex justify-center">
                <div className="rounded-lg flex items-center justify-center">
                  <Image src={need_learning} alt="hero_trusted"></Image>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Learn From Experts
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Real-world knowledge from industry leaders.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 bg-[#EAF7FD80] py-[44px]">
              <div className="flex justify-center">
                <div className="rounded-lg flex items-center justify-center">
                  <Image src={need_access} alt="hero_trusted"></Image>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Lifetime Access
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn anytime, at your own pace
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 bg-[#EAF7FD80] py-[44px]">
              <div className="flex justify-center">
                <div className="rounded-lg flex items-center justify-center">
                  <Image src={need_pricing} alt="hero_trusted"></Image>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Affordable Pricing
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Quality learning without the affordable cost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Need;
