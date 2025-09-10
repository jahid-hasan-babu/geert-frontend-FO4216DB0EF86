/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import { InstructorModal } from "../modals/InstructorModal";
import DOMPurify from "isomorphic-dompurify";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

interface Review {
  id: string;
  text: string;
  rating: number;
  date: string;
  author: string;
}

export interface Instructor {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  role: "INSTRUCTOR" | "STUDENT" | "ADMIN";
  phone: string | null;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
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
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
      {/* Responsive Tabs */}
      <TranslateInitializer />
      <div className="flex mb-4 sm:mb-6 text-sm sm:text-base">
        <button
          onClick={() => setActiveTab("about")}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-l-full font-semibold transition-colors cursor-pointer duration-200 ${
            activeTab === "about"
              ? "bg-[#C0DFEF] text-[#070707]"
              : "bg-sky-100 text-gray-600 hover:bg-sky-150"
          }`}
          data-translate
        >
          About
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-r-full font-semibold transition-colors cursor-pointer duration-200 ${
            activeTab === "reviews"
              ? "bg-[#C0DFEF] text-[#070707]"
              : "bg-sky-100 text-gray-600 hover:bg-sky-150"
          }`}
          data-translate
        >
          Reviews{" "}
          {reviews.length > 0 && (
            <span className="ml-1 text-xs sm:text-sm bg-white/30 px-2 py-0.5 rounded-full">
              {reviews.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "about" ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Description Section */}
          <TranslateInitializer></TranslateInitializer>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3
              className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4"
              data-translate
            >
              Course Description
            </h3>
            <div className="text-gray-700 leading-relaxed prose max-w-none">
              <div
                className="text-sm sm:text-base leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    showFullDescription ? description : shortDescription
                  ),
                }}
              />
              {description.length > 260 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sky-500 hover:text-sky-600 font-medium ml-1 cursor-pointer text-sm sm:text-base transition-colors duration-200"
                  data-translate
                >
                  {showFullDescription ? " Read Less" : " ... Read More"}
                </button>
              )}
            </div>
          </div>

          {/* Instructor Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <h3
              className="text-lg sm:text-xl font-semibold text-gray-900 p-4 sm:p-6 pb-3 sm:pb-4"
              data-translate
            >
              Meet Your Instructor
            </h3>
            <div
              className="p-4 sm:p-6 pt-0 flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-b-lg"
              onClick={() => setIsInstructorOpen(true)}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden relative flex-shrink-0 ring-2 ring-gray-200">
                <Image
                  src={instructor?.profileImage || "/default-avatar.png"}
                  alt={instructor?.username || "Instructor"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs sm:text-sm text-gray-600 mb-1"
                  data-translate
                >
                  Instructor
                </p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {instructor?.username}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {instructor?.email}
                </p>
              </div>
              <div className="text-gray-400 text-sm sm:text-base">→</div>
            </div>
          </div>
        </div>
      ) : (
        // Reviews Tab
        <div className="space-y-4 sm:space-y-6">
          <TranslateInitializer />
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg p-8 sm:p-12 text-center shadow-sm border border-gray-100">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📝</div>
              <p
                className="text-gray-500 text-base sm:text-lg mb-2"
                data-translate
              >
                No reviews yet
              </p>
              <p className="text-gray-400 text-sm sm:text-base" data-translate>
                Be the first to share your experience with this course!
              </p>
            </div>
          ) : (
            <>
              {/* Reviews Header */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3
                    className="text-lg sm:text-xl font-semibold text-gray-900"
                    data-translate
                  >
                    Student Reviews ({reviews.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => {
                        const avgRating =
                          reviews.reduce(
                            (acc, review) => acc + review.rating,
                            0
                          ) / reviews.length;
                        return (
                          <span
                            key={i}
                            className={`text-lg sm:text-xl ${
                              i < Math.round(avgRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-sm sm:text-base text-gray-600 font-medium">
                      {(
                        reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0
                        ) / reviews.length
                      ).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Review Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm sm:text-base ${
                                i < review?.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 font-medium">
                          {review.rating}/5
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-400">
                        {review.date}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                      {review.text}
                    </p>

                    {/* Review Author */}
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base font-medium">
                        {review.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More Reviews Button (if many reviews) */}
              {reviews.length > 6 && (
                <div className="text-center">
                  <button
                    className="bg-sky-500 hover:bg-sky-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                    data-translate
                  >
                    View All Reviews
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Instructor Modal */}
      <InstructorModal
        isOpen={isInstructorOpen}
        onClose={() => setIsInstructorOpen(false)}
        instructorId={instructor.id}
      />
    </div>
  );
}
