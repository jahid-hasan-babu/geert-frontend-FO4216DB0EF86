"use client";
import NavBar from "@/components/shared/NavBar/navComponent/NavBar";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <>
      <NavBar />
      <div className="relative flex items-center justify-center px-6 mt-20 lg:mt-32 min-h-[60vh]">
        {/* Background 404 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-[15rem] md:text-[20rem] lg:text-[248px] font-medium leading-[120%] text-[#2CA2D1]/[0.04] select-none">
            404
          </span>
        </div>

        {/* Foreground content */}
        <div className="relative text-center max-w-md mx-auto z-10">
          <h1 className="text-8xl md:text-9xl font-bold text-gray-900 mb-6">
            404
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            The page you&#39;re looking for doesn&#39;t exist
            <br />
            but plenty of great content does!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
