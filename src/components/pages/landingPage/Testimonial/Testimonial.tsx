import { statisticsData, testimonialsData } from "@/utils/dummyData";
import React from "react";

const Testimonial = () => {

  return (
    <section className="py-16 lg:py-24 bg-[#F4FAFD]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 font-playfairDisplay">
            Words from Our Community
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="text-center space-y-[20px]">
              {/* Testimonial Text */}
              <p className="text-[#404040] leading-[120%] text-lg">
                {testimonial.text}
              </p>

              <div>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg font-bold">
                      ★
                    </span>
                  ))}
                </div>

                {/* Author Info */}
                <div className="">
                  <h4 className="text-gray-600 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-black font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="border-t border-gray-200 pt-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {statisticsData.map((stat, index) => (
              <div key={index} className="relative">
                {/* Divider line (except for last item) */}
                {index < statisticsData.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gray-300"></div>
                )}

                <div className="space-y-2">
                  <div className="text-5xl lg:text-7xl font-medium text-gray-900">
                    {stat.number}
                  </div>
                  <p className="text-gray-600 text-xl">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
