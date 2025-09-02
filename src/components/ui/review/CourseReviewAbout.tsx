/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import { InstructorModal } from "../modals/InstructorModal";
import DOMPurify from "isomorphic-dompurify";

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
          <div className="bg-white rounded-lg p-4">
            <div className="text-gray-700 leading-relaxed mb-2 prose max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    showFullDescription ? description : shortDescription
                  ),
                }}
              />
              {description.length > 260 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sky-500 hover:text-sky-600 font-medium ml-1 cursor-pointer"
                >
                  {showFullDescription ? " Read Less" : " ... Read More"}
                </button>
              )}
            </div>
          </div>

          {/* Instructor */}
          <div
            className="bg-white rounded-lg p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setIsInstructorOpen(true)}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden relative">
              <Image
                src={instructor?.profileImage || "/default-avatar.png"}
                alt={instructor?.username || "Instructor"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600">Instructor</p>
              <p className="font-semibold text-gray-900">
                {instructor?.username}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Reviews Tab
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No reviews yet.</p>
          ) : (
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
                            i < review?.rating
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
