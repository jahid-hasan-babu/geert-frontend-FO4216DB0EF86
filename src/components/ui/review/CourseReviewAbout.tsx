"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
// import InstructorModal from "../modals/InstructorModal";
import { InstructorModalTwo } from "../modals/InstructorModalTwo";

interface Review {
  id: string;
  text: string;
  rating: number;
  date: string;
  author: string;
}

interface Instructor {
  name: string;
  avatar: string | StaticImageData;
  bio?: string;
}

interface Props {
  description: string;
  instructor: Instructor;
  reviews: Review[];
}

export default function CourseReviewAbout({
  description,
  instructor,
  reviews,
}: Props) {
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isInstructorOpen, setIsInstructorOpen] = useState(false);

  const shortDescription = description.slice(0, 260);

  return (
    <div className="mx-auto">
      {/* Tabs */}
      <div className="flex mb-2 text-[14px]">
        <button
          onClick={() => setActiveTab("about")}
          className={`flex-1 py-4 px-6 rounded-l-full font-semibold transition-colors cursor-pointer duration-200 ${
            activeTab === "about"
              ? "bg-[#C0DFEF] text-[#070707]"
              : "bg-sky-100 text-gray-600 hover:bg-sky-100"
          }`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 py-4 px-6 rounded-r-full font-semibold transition-colors cursor-pointer duration-200 ${
            activeTab === "reviews"
              ? "bg-[#C0DFEF] text-[#070707]"
              : "bg-sky-100 text-gray-600 hover:bg-sky-100"
          }`}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "about" ? (
        <div>
          {/* Course Description */}
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed mb-2">
              {showFullDescription ? description : shortDescription}
              {description.length > 260 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sky-500 hover:text-sky-600 font-medium ml-1"
                >
                  {showFullDescription ? " Read Less" : " ... Read More"}
                </button>
              )}
            </p>
          </div>

          {/* Instructor */}
          <div
            className="bg-white rounded-lg p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setIsInstructorOpen(true)}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <Image
                src={instructor.avatar || "/placeholder.svg"}
                alt={instructor.name}
                width={56}
                height={56}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600">Instructor</p>
              <p className="font-semibold text-gray-900">{instructor.name}</p>
            </div>
          </div>
        </div>
      ) : (
        // Reviews Tab
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg p-6 space-y-4 shadow-sm"
              >
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm font-medium">
                    {review.rating} | {review.date}
                  </span>
                </div>
                <p className="text-gray-500 text-sm italic">
                  — {review.author}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="hover:bg-sky-200 bg-[#EBF5FA] px-8 py-3 rounded-full font-medium transition-colors duration-200 w-full cursor-pointer">
              View More
            </button>
          </div>
        </div>
      )}

      {/* Instructor Modal */}
      {/* <InstructorModal
        isOpen={isInstructorOpen}
        onClose={() => setIsInstructorOpen(false)}
        instructor={instructor}
      /> */}
      <InstructorModalTwo
        isOpen={isInstructorOpen}
        onClose={() => setIsInstructorOpen(false)}
      />
    </div>
  );
}
