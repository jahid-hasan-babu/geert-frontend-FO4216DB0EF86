"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSendContactFormMutation } from "@/redux/features/contact/contactApi";
import { contactFormSchema } from "@/lib/validations/contact";
import { toast } from "sonner";
import { Spin } from "antd";

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
        if (error.path[0]) {
          fieldErrors[String(error.path[0])] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await sendContactForm(validation.data).unwrap();
      toast("Your message has been sent successfully.");
      setFormData({
        fullName: "",
        email: "",
        question: "",
        description: "",
      });
    } catch {
      toast("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <section className="py-16 lg:py-[80px]">
        <div className="container mx-auto px-6">
          <div className="relative text-center mb-16">
            <div className="absolute inset-0 flex justify-center pointer-events-none z-0">
              <span className="text-[15rem] md:text-[20rem] lg:text-[248px] font-medium leading-[120%] text-[#2CA2D1]/[0.04] select-none font-playfairDisplay">
                CONTACT
              </span>
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-playfairDisplay">
                Contact
              </h1>
              <p className="text-lg text-gray-600 mx-auto max-w-2xl">
                Have questions or need help? Reach out — we&apos;re here to
                support you.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
            <div className="lg:col-span-2 relative z-10">
              <Spin spinning={isLoading} tip="Sending..." size="large">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
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
                        placeholder="Email Address"
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
                      placeholder="What's your question?"
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
                      placeholder="Describe your issue"
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
                    className="w-full bg-[#3399CC] hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-8 rounded-full font-semibold text-lg transition-colors duration-200 cursor-pointer"
                  >
                    Submit
                  </button>
                </form>
              </Spin>
            </div>

            <div className="lg:col-span-1 relative z-10">
              <h2 className="text-2xl md:text-4xl text-gray-900 mb-[18px] font-playfairDisplay">
                Get in touch with our experts team
              </h2>

              <div className="space-y-[12px] font-sans">
                <div className="bg-[#EBF5FA] p-6 rounded-xl">
                  <div className="space-y-[12px]">
                    <div className="flex items-center space-x-[6px]">
                      <Mail className="w-6 h-5 text-[#404040]" />
                      <p className="text-[#404040]">Email</p>
                    </div>
                    <div className="border-b-[0.5px] border-[#76BBDD]"></div>
                    <div className="">
                      <p className="text-[#404040] text-sm">vmta@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#EBF5FA] p-6 rounded-xl">
                  <div className="space-y-[12px]">
                    <div className="flex items-center space-x-[6px]">
                      <Phone className="w-6 h-5 text-[#404040]" />
                      <p className="text-[#404040]">Phone</p>
                    </div>
                    <div className="border-b-[0.5px] border-[#76BBDD]"></div>
                    <div className="">
                      <p className="text-[#404040] text-sm">
                        +1 (354) 456-1565
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#EBF5FA] p-6 rounded-xl">
                  <div className="space-y-[12px]">
                    <div className="flex items-center space-x-[6px]">
                      <MapPin className="w-6 h-5 text-[#404040]" />
                      <p className="text-[#404040]">Location</p>
                    </div>
                    <div className="border-b-[0.5px] border-[#76BBDD]"></div>
                    <div className="">
                      <p className="text-[#404040] text-sm">
                        California [CA], 90011 49th St, Los Angeles, United
                        States
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
