"use client";

import AppStore_Button from "@/assets/images/AppStore_button.png";
import PlayStore_Button from "@/assets/images/PlayStore_button.png";
import Promotion_banner from "@/assets/images/Promotion_banner.png";
import Image from "next/image";
import Link from "next/link";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

export default function Promotion() {
  return (
    <section className="container bg-[#F4FAFD] mb-[80px] py-8 lg:py-0">
      <TranslateInitializer />
      <div className="mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-[24px]">
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 font-playfairDisplay leading-[120%]"
                data-translate
              >
                Take Your Learning Experience Anywhere, Anytime You Go
              </h2>
              <p
                className="text-lg md:text-lg text-gray-600 leading-[150%]"
                data-translate
              >
                Download our mobile app to access courses, track progress, and
                learn on your schedule—anytime, anywhere.
              </p>
            </div>

            {/* App Store Buttons */}
            <div className="flex gap-4">
              {/* App Store Button */}
              <Link
                href="https://www.apple.com/app-store/"
                target="_blank"
                className="justify-center text-white rounded-lg transition-colors duration-200"
              >
                <Image src={AppStore_Button} alt="App Store" />
              </Link>

              {/* Google Play Button */}
              <Link
                href="https://play.google.com/"
                target="_blank"
                className="justify-center text-white rounded-lg transition-colors duration-200"
              >
                <Image src={PlayStore_Button} alt="Google Play" />
              </Link>
            </div>
          </div>

          {/* Right Side - Mobile Mockups */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <Image src={Promotion_banner} alt="Promotion Banner" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
