"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSendContactFormMutation } from "@/redux/features/contact/contactApi";
import { contactFormSchema } from "@/lib/validations/contact";
import { toast } from "sonner";
import { Spin } from "antd";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    question: "",
    description: "",
  });

  const [sendContactForm, { isLoading }] = useSendContactFormMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const apiData = {
      name: formData.fullName,
      email: formData.email,
      questions: formData.question,
      message: formData.description,
    };

    const validation = contactFormSchema.safeParse(apiData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) fieldErrors[String(error.path[0])] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await sendContactForm(validation.data).unwrap();
      toast(
        <span data-translate>Your message has been sent successfully.</span>
      );
      setFormData({ fullName: "", email: "", question: "", description: "" });
    } catch {
      toast(
        <span data-translate>Failed to send message. Please try again.</span>
      );
    }
  };

  useEffect(() => {
    function fixPlaceholders() {
      document
        .querySelectorAll(
          "input[data-translate-placeholder], textarea[data-translate-placeholder]"
        )
        .forEach((el) => {
          const input = el as HTMLInputElement | HTMLTextAreaElement;

          if (
            !input.nextElementSibling?.classList.contains(
              "translate-placeholder-proxy"
            )
          ) {
            const span = document.createElement("span");
            span.style.display = "none";
            span.className = "translate-placeholder-proxy";
            span.setAttribute("data-translate", "");
            span.innerText =
              input.getAttribute("data-translate-placeholder") || "";
            input.insertAdjacentElement("afterend", span);

            // Sync translations back to placeholder
            const observer = new MutationObserver(() => {
              input.placeholder = span.innerText;
            });
            observer.observe(span, { childList: true, subtree: true });

            // Set initial placeholder
            input.placeholder = span.innerText;
          }
        });
    }

    fixPlaceholders();
  }, []);

  return (
    <>
      <TranslateInitializer />

      <section className="py-16 lg:py-[80px]">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="relative text-center mb-16">
            <div className="absolute inset-0 flex justify-center pointer-events-none z-0">
              <span
                data-translate
                className="text-[15rem] md:text-[20rem] lg:text-[248px] font-medium leading-[120%] text-[#2CA2D1]/[0.04] select-none font-playfairDisplay"
              >
                CONTACT
              </span>
            </div>
            <div className="relative z-10">
              <h1
                data-translate
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-playfairDisplay"
              >
                Contact
              </h1>
              <p
                data-translate
                className="text-lg text-gray-600 mx-auto max-w-2xl"
              >
                Have questions or need help? Reach out — we&apos;re here to
                support you.
              </p>
            </div>
          </div>

          {/* Form + Contact Info */}
          <div className="grid lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2 relative z-10">
              <Spin spinning={isLoading} tip="Sending..." size="large">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        data-translate-placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-[#EBF5FA] border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                          errors.name ? "border-red-500" : "border-gray-200"
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        data-translate-placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-[#EBF5FA] border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                          errors.email ? "border-red-500" : "border-gray-200"
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="question"
                      data-translate-placeholder="What's your question?"
                      value={formData.question}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-[#EBF5FA] border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                        errors.questions ? "border-red-500" : "border-gray-200"
                      }`}
                      required
                    />
                    {errors.questions && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.questions}
                      </p>
                    )}
                  </div>

                  <div>
                    <textarea
                      name="description"
                      data-translate-placeholder="Describe your issue"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={8}
                      className={`w-full px-4 py-4 bg-[#EBF5FA] border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none ${
                        errors.message ? "border-red-500" : "border-gray-200"
                      }`}
                      required
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    data-translate
                    className="w-full bg-[#3399CC] hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-8 rounded-full font-semibold text-lg transition-colors duration-200 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </Spin>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1 relative z-10">
              <h2
                data-translate
                className="text-2xl md:text-4xl text-gray-900 mb-[18px] font-playfairDisplay"
              >
                Get in touch with our experts team
              </h2>

              <div className="space-y-[12px] font-sans">
                <div className="bg-[#EBF5FA] p-6 rounded-xl">
                  <div className="space-y-[12px]">
                    <div className="flex items-center space-x-[6px]">
                      <Mail className="w-6 h-5 text-[#404040]" />
                      <p data-translate className="text-[#404040]">
                        Email
                      </p>
                    </div>
                    <div className="border-b-[0.5px] border-[#76BBDD]"></div>
                    <div>
                      <p className="text-[#404040] text-sm">info@mijnvmta.nl</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EBF5FA] p-6 rounded-xl">
                  <div className="space-y-[12px]">
                    <div className="flex items-center space-x-[6px]">
                      <Phone className="w-6 h-5 text-[#404040]" />
                      <div className="text-[#404040]">
                        <div data-translate>Phone</div>
                        <div className="text-[10px]" data-translate>
                          ( We are available by phone from Monday to Friday from
                          9:00 AM to 2:00 PM )
                        </div>
                      </div>
                    </div>
                    <div className="border-b-[0.5px] border-[#76BBDD]"></div>
                    <div>
                      <p className="text-[#404040] text-sm">+0512-361228</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EBF5FA] p-6 rounded-xl">
                  <div className="space-y-[12px]">
                    <div className="flex items-center space-x-[6px]">
                      <MapPin className="w-6 h-5 text-[#404040]" />
                      <p data-translate className="text-[#404040]">
                        Location
                      </p>
                    </div>
                    <div className="border-b-[0.5px] border-[#76BBDD]"></div>
                    <div>
                      <p className="text-[#404040] text-sm" data-translate>
                        Meander 19, 9231DB Surhuisterveen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
