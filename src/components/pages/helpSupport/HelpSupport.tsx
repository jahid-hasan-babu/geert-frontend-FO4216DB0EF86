import React from "react";

const HelpSupport = () => {
  return (
    <section className="relative py-16 lg:py-24 text-white overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#101010] mb-4 font-playfairDisplay">
          Help & Support
        </h2>
        <p className="text-md md:text-lg text-gray-400 mb-10 mx-auto lg:w-1/4">
          Quick solutions, helpful resources, and dedicated support all in one
          place.
        </p>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[15rem] md:text-[20rem] lg:text-[248px] font-medium leading-[120%] text-[#2CA2D1]/[0.04] select-none font-playfairDisplay">
            HELP
          </span>
        </div>
        <p className="max-w-3xl text-base md:text-lg text-[#5F5F5F] leading-[160%] mx-auto relative z-10 font-medium">
          Welcome to our Help & Support center! Here you&#39;ll find answers to
          common questions about account access, payments, and course issues. If
          you&#39;re having trouble logging in or resetting your password, our
          step-by-step guide can help. You can also manage your subscriptions,
          update billing details, or request a refund easily through your
          profile. If a course isn&#39;t loading properly or your progress
          isn&#39;t saving, we&#39;re here to fix it fast. For anything else,
          feel free to reach out to our support team via email or live chat — we
          typically respond within 24 hours. Our support hours are Monday to
          Friday, from 9 AM to 6 PM (GMT+6). We&#39;re here to make sure your
          experience is smooth and stress-free.
        </p>
      </div>
    </section>
  );
};

export default HelpSupport;
