import AppStore_Button from "@/assets/images/AppStore_button.png";
import PlayStore_Button from "@/assets/images/PlayStore_button.png";
import Promotion_banner from "@/assets/images/Promotion_banner.png";
import Image from "next/image";
import Link from "next/link";

export default function Promotion() {
  return (
    <section className="container bg-[#F4FAFD] mb-[80px] py-8 lg:py-0">
      <div className="mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-[24px]">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 font-playfairDisplay leading-[120%]">
                Take Your Learning Experience Anywhere, Anytime You Go
              </h2>
              <p className="text-lg md:text-lg text-gray-600 leading-[150%]">
                Download our mobile app to access courses, track progress, and learn on your schedule—anytime, anywhere.
              </p>
            </div>

            {/* App Store Buttons */}
            <div className="flex gap-4">
              {/* App Store Button */}
              <Link
                href="#"
                className="justify-center text-white rounded-lg transition-colors duration-200"
              >
                {/* <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <Image src={AppStore_Button} alt=""></Image>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </div> */}
                <Image src={AppStore_Button} alt=""></Image>
              </Link>

              {/* Google Play Button */}
              <Link
                href="#"
                className="justify-center text-white rounded-lg transition-colors duration-200"
              >
                {/* <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <Image src={PlayStore_Button} alt=""></Image>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </div> */}
                <Image src={PlayStore_Button} alt=""></Image>
              </Link>
            </div>
          </div>

          {/* Right Side - Mobile Mockups */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <Image src={Promotion_banner} alt=""></Image>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
