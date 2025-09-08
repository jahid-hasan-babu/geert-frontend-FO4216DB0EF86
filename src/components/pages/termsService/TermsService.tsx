"use client";

import React from "react";
import { useGetLegalDataQuery } from "@/redux/features/legal/legalApi";
import { Spin } from "antd";

const PrivacyPolicy = () => {
  const { data, isLoading } = useGetLegalDataQuery(undefined);

  if (isLoading) {
    return (
      <section className="container bg-white">
        <div className="mx-auto px-2 md:px-4 lg:px-6 py-12 text-center">
          <Spin size="large" tip="Loading help content..." />
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 lg:py-24 text-white overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#101010] mb-4 font-playfairDisplay">
          Terms of Service
        </h2>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[15rem] md:text-[20rem] lg:text-[248px] font-medium leading-[120%] text-[#2CA2D1]/[0.04] select-none font-playfairDisplay">
            TERMS
          </span>
        </div>

        {/* ✅ Render HTML safely */}
        <div
          className="max-w-3xl text-base md:text-lg text-[#5F5F5F] leading-[160%] mx-auto relative z-10 font-medium"
          dangerouslySetInnerHTML={{ __html: data?.privacyPolicy || "" }}
        />
      </div>
    </section>
  );
};

export default PrivacyPolicy;
