import Image from "next/image";
import React from "react";
import need_learning from "@/assets/images/need_learning.png";
import need_access from "@/assets/images/need_access.png";
import need_pricing from "@/assets/images/need_pricing.png";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

const Need = () => {
  return (
    <>
      <section className="py-16 lg:py-24">
        {/* Initialize translation */}
        <TranslateInitializer />

        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 lg:w-1/2 mx-auto">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 font-playfairDisplay"
              data-translate
            >
              Everything You Need to Succeed in One Platform
            </h2>
            <p
              className="text-lg md:text-[18px] text-gray-600 leading-relaxed lg:w-[65%] mx-auto"
              data-translate
            >
              Top-quality courses, expert mentors, and lifetime access. Learn at
              your own pace and turn knowledge into action.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-x-[30px]">
            {/* Card 1 */}
            <div className="text-center space-y-6 bg-[#EAF7FD80] py-[44px]">
              <div className="flex justify-center">
                <div className="rounded-lg flex items-center justify-center">
                  <Image src={need_learning} alt="Learn From Experts" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900" data-translate>
                  Learn From Experts
                </h3>
                <p className="text-gray-600 leading-relaxed" data-translate>
                  Real-world knowledge from industry leaders.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="text-center space-y-6 bg-[#EAF7FD80] py-[44px]">
              <div className="flex justify-center">
                <div className="rounded-lg flex items-center justify-center">
                  <Image src={need_access} alt="Lifetime Access" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900" data-translate>
                  Lifetime Access
                </h3>
                <p className="text-gray-600 leading-relaxed" data-translate>
                  Learn anytime, at your own pace
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="text-center space-y-6 bg-[#EAF7FD80] py-[44px]">
              <div className="flex justify-center">
                <div className="rounded-lg flex items-center justify-center">
                  <Image src={need_pricing} alt="Affordable Pricing" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900" data-translate>
                  Affordable Pricing
                </h3>
                <p className="text-gray-600 leading-relaxed" data-translate>
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
