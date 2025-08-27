import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import WhyUs_1 from "@/assets/images/WhyUs_1.png";
import WhyUs_2 from "@/assets/images/WhyUs_2.png";
import WhyUs_3 from "@/assets/images/WhyUs_3.png";
import WhyUs_4 from "@/assets/images/WhyUs_4.png";
import WhyUs_Banner from "@/assets/images/WhyUs_Banner.png";

const WhyUs = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-16 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 leading-tight font-playfairDisplay">
            Built for Learners.
            <br />
            Backed by Results.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our platform combines expert instruction, practical skills, and
            learner support that sets you up for success.
          </p>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-3 gap-x-[30px] items-center">
          {/* Left Features */}
          <div className="flex flex-col justify-between space-y-[30px] h-full">
            <FeatureBlock
              image={WhyUs_1}
              text="Learn from industry experts with real-world experience and proven teaching methods."
            />
            <FeatureBlock
              image={WhyUs_3}
              text="Enjoy lifetime access to all your courses, updates, and future bonus content."
            />
          </div>

          {/* Center Image */}
          <div className="flex justify-center">
            <div className="bg-gray-200 rounded-2xl">
              <Image
                src={WhyUs_Banner}
                alt="Why Us Banner"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Right Features */}
          <div className="flex flex-col justify-between space-y-[30px] h-full">
            <FeatureBlock
              image={WhyUs_2}
              text="Get certified and showcase your skills with confidence across top platforms."
            />
            <FeatureBlock
              image={WhyUs_4}
              text="Affordable pricing without compromising on quality, value, or learner satisfaction."
            />
          </div>
        </div>

        {/* Mobile & Tablet layout */}
        <div className="lg:hidden space-y-12 px-4">
          <div className="flex justify-center">
            <Image
              src={WhyUs_Banner}
              alt="Why Us Banner"
              width={280}
              height={360}
              className="rounded-xl"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <MobileFeature
              image={WhyUs_1}
              text="Learn from industry experts with real-world experience and proven teaching methods."
            />
            <MobileFeature
              image={WhyUs_2}
              text="Get certified and showcase your skills with confidence across top platforms."
            />
            <MobileFeature
              image={WhyUs_3}
              text="Enjoy lifetime access to all your courses, updates, and future bonus content."
            />
            <MobileFeature
              image={WhyUs_4}
              text="Affordable pricing without compromising on quality, value, or learner satisfaction."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

// Desktop Feature Block
const FeatureBlock = ({ image, text }: { image: StaticImageData; text: string }) => (
  <div className="flex flex-col items-start justify-between space-y-4 bg-[#F4FAFD] h-full p-6 rounded-xl shadow-sm">
    <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
      <Image src={image} alt="Feature Icon" width={32} height={32} />
    </div>
    <p className="text-gray-700 leading-relaxed text-lg">{text}</p>
  </div>
);

// Mobile Feature Block
const MobileFeature = ({ image, text }: { image: StaticImageData; text: string }) => (
  <div className="flex flex-col items-center text-center space-y-4">
    <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
      <Image src={image} alt="Feature Icon" width={32} height={32} />
    </div>
    <p className="text-gray-700 leading-relaxed text-base">{text}</p>
  </div>
);
