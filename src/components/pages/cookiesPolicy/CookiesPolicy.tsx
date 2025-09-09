"use client";

import React from "react";
import { useGetLegalDataQuery } from "@/redux/features/legal/legalApi";
import { Spin } from "antd";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

const CookiePolicy = () => {
  const { data, isLoading } = useGetLegalDataQuery(undefined);

  if (isLoading) {
    return (
      <section className="container bg-white">
        <div className="mx-auto px-2 md:px-4 lg:px-6 py-12 text-center">
          <Spin size="large" tip="Loading Cookie Policy..." />
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 lg:py-24 text-white overflow-hidden">
      {/* Initialize translator */}
      <TranslateInitializer />

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2
          data-translate
          className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#101010] mb-4 font-playfairDisplay"
        >
          Cookie Policy
        </h2>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            data-translate
            className="text-[15rem] md:text-[20rem] lg:text-[248px] font-medium leading-[120%] text-[#2CA2D1]/[0.04] select-none font-playfairDisplay"
          >
            COOKIE
          </span>
        </div>

        {/* Render HTML safely */}
        <div
          data-translate-html
          className="max-w-3xl text-base md:text-lg text-[#5F5F5F] leading-[160%] mx-auto relative z-10 font-medium"
          dangerouslySetInnerHTML={{ __html: data?.cookiePolicy || "" }}
        />
      </div>
    </section>
  );
};

export default CookiePolicy;
