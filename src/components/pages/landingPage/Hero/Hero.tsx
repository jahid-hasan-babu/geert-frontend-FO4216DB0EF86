// import { images } from "@/utils/images";
import Image from "next/image";
import hero_learners_1 from "@/assets/images/hero_learners_1.png";
import hero_learners_2 from "@/assets/images/hero_learners_2.png";
import hero_learners_3 from "@/assets/images/hero_learners_4.png";
import hero_learners_4 from "@/assets/images/hero_learners_4.png";
import heroBanner from "@/assets/images/hero_banner.png";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton/PrimaryButton";
import Partners from "@/components/common/Partners";

export default function Hero() {
  return (
    <section className="container bg-white">
      <div className="mx-auto px-2 md:px-4 lg:px-6 py-2 md:py-12 lg:py-24">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8 lg:col-span-3">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-2xl md:text-5xl lg:text-[64px] font-bold text-gray-900 font-playfairDisplay">
                Unlock Your Potential with Expert Courses
              </h1>
              <p className="text-md md:text-lg text-gray-500 leading-relaxed lg:w-[75%]">
                Start your learning journey today with courses designed for
                real-world success. Gain practical skills, earn certificates,
                and stand out in your career.
              </p>
            </div>

            {/* Updated Button */}
            <PrimaryButton label="Get Start" />

            {/* Social Proof */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <Image src={hero_learners_1} alt="hero_trusted"></Image>
                <Image src={hero_learners_2} alt="hero_trusted"></Image>
                <Image src={hero_learners_3} alt="hero_trusted"></Image>
                <Image src={hero_learners_4} alt="hero_trusted"></Image>
              </div>
              <p className="text-gray-600 font-medium text-xs md:text-base">
                Trusted by 5,000+ learners
              </p>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end lg:col-span-2">
            <div className="relative w-full max-w-lg">
              <Image
                src={heroBanner}
                alt="Online learning illustration showing people studying with laptops, books, and educational elements"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <Partners />
    </section>
  );
}
