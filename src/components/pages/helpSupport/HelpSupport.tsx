"use client";

import React from "react";
import { useGetHelpSupportQuery } from "@/redux/features/legal/legalApi";
import { Spin } from "antd";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

const HelpSupport = () => {
  const { data, isLoading } = useGetHelpSupportQuery(undefined);

  if (isLoading) {
    return (
      <section className="container bg-white">
        <div className="mx-auto px-2 md:px-4 lg:px-6 py-12 text-center">
          <Spin size="large" tip="Loading help content..." />
        </div>
      </section>
    );
  }

  const dynamicContent = data?.data[0]?.description || "No help content available.";

  return (
    <section className="relative py-16 lg:py-24 text-white overflow-hidden">
      {/* Initialize translator */}
      <TranslateInitializer />

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2
          data-translate
          className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#101010] mb-4 font-playfairDisplay"
        >
          Help & Support
        </h2>
        <p
          data-translate
          className="text-md md:text-lg text-gray-400 mb-10 mx-auto lg:w-1/4"
        >
          Quick solutions, helpful resources, and dedicated support all in one
          place.
        </p>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            data-translate
            className="text-[15rem] md:text-[20rem] lg:text-[248px] font-medium leading-[120%] text-[#2CA2D1]/[0.04] select-none font-playfairDisplay"
          >
            HELP
          </span>
        </div>

        {/* ✅ Dynamic content translatable */}
        <div
          data-translate-html
          className="max-w-3xl text-base md:text-lg text-[#5F5F5F] leading-[160%] mx-auto relative z-10 font-medium"
          dangerouslySetInnerHTML={{ __html: dynamicContent }}
        />
      </div>
    </section>
  );
};

export default HelpSupport;
