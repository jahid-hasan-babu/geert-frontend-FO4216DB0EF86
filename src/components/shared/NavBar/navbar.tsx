/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bell, Star, X } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

import logo from "@/assets/images/logo.png";
import NotificationModal from "@/components/ui/modals/NotificationModal";
import { ReviewModal } from "@/components/ui/modals/ReviewModal";
import { CourseProgressModal } from "@/components/ui/modals/CourseProgressModal";
import { MenuModal } from "@/components/ui/modals/MenuModal";
import { useGetNotificationsQuery } from "@/redux/features/notification/notificationsApi";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import {
  useGetCourseByIdQuery,
  useGetMyCourseProgressQuery,
} from "@/redux/features/courses/coursesApi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact" },
  { href: "/help-support", label: "Support" },
];

interface User {
  id: string;
  username: string | null;
  email: string;
  profileImage: string | null;
  role: string;
}

interface Course {
  [x: string]: any;
  id: string;
  title: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [courseData, setCourseData] = useState<Course | null>(null);

  const pathname = usePathname();
  const { data: notificationsRes, isLoading: isLoadingNotifications } =
    useGetNotificationsQuery({});
  const { data: userRes, isLoading: isLoadingUser } = useGetMeQuery({});
  const courseId = pathname.split("/")[2];
  const { data: courseRes, isLoading: isLoadingCourse } =
    useGetCourseByIdQuery(courseId);
  const courseIdForProgress = courseData?.id;
  const { data: Progress } = useGetMyCourseProgressQuery(courseIdForProgress);

  // Set user data
  useEffect(() => {
    if (userRes?.data) {
      setUserData(userRes.data);
    }
  }, [userRes?.data]);

  // Set course data
  useEffect(() => {
    if (courseRes?.data) {
      setCourseData(courseRes.data);
    }
  }, [courseRes?.data]);

  const notificationsData = notificationsRes?.data?.data || [];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="cursor-pointer flex items-center justify-center"
        >
          <Image src={logo || "/placeholder.svg"} alt="Logo" />
        </Link>

        {/* Desktop Nav */}
        <div className="flex items-center">
          <ul className="hidden md:flex items-center space-x-8 font-medium font-sans">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition-colors duration-300 ${
                    isActive(href)
                      ? "text-[#3399CC] font-semibold"
                      : "text-gray-800 hover:text-[#9191c4]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Course-specific buttons */}
          {(pathname === `/courses/${courseData?.id}` ||
            pathname === `/courses/${courseData?.id}/progress`) && (
            <div className="ml-4 hidden lg:flex items-center space-x-4">
              {isLoadingCourse && <Spin indicator={<LoadingOutlined spin />} />}
              <button
                onClick={() => setIsReviewOpen(true)}
                className="flex items-center space-x-1 font-sans text-gray-700"
              >
                <Star className="w-5 h-5 text-gray-500" />
                <span className="font-medium cursor-pointer">Leave Review</span>
              </button>
              <div
                className="cursor-pointer text-gray-700 font-medium"
                onClick={() => setIsProgressOpen(true)}
              >
                Your Progress
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Notification Button */}
          <button
            className="relative p-2 rounded-full bg-[#EBF5FA] transition"
            onClick={() => setIsNotifOpen(true)}
          >
            <Bell className="w-6 h-6 text-[#5F5F5F] cursor-pointer" />
            {notificationsData.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* User Avatar */}
          {isLoadingUser || isLoadingCourse ? (
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          ) : (
            <div
              className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 cursor-pointer"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <Image
                src={
                  userData?.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                width={28}
                height={28}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 md:hidden"
      >
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        <Dialog.Panel className="fixed inset-y-0 right-0 w-64 bg-white p-6 space-y-6 shadow-lg">
          {/* Top: Logo + Close */}
          <div className="flex justify-between items-center">
            <Image
              src={logo || "/placeholder.svg"}
              alt="Logo"
              width={28}
              height={28}
            />
            <button onClick={() => setIsOpen(false)} aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Course Title */}
          {courseData && !isLoadingCourse && (
            <h1 className="text-lg font-semibold">{courseData.title}</h1>
          )}

          {/* Nav Links */}
          <ul className="flex flex-col space-y-4 text-gray-800 font-medium">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block ${
                    isActive(href)
                      ? "text-[#3399CC] font-semibold"
                      : "hover:text-[#9191c4]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Course-specific buttons */}
          {courseData && (
            <div className="flex flex-col space-y-2 mt-4">
              <button
                onClick={() => setIsReviewOpen(true)}
                className="flex items-center justify-center lg:justify-start space-x-1 font-sans text-gray-700"
              >
                <Star className="w-5 h-5 text-gray-500" />
                <span className="font-medium cursor-pointer">Leave Review</span>
              </button>
              <button
                onClick={() => setIsProgressOpen(true)}
                className="font-medium text-gray-700 cursor-pointer"
              >
                Your Progress
              </button>
            </div>
          )}

          {/* Bottom: Notifications + User Avatar */}
          <div className="flex items-center space-x-4 pt-4 border-t">
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setIsNotifOpen(true)}
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {notificationsData.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {isLoadingUser || isLoadingCourse ? (
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            ) : (
              <Image
                src={
                  userData?.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                width={28}
                height={28}
                className="rounded-full border border-gray-200 cursor-pointer"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              />
            )}
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Modals */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notificationsData}
        isLoading={isLoadingNotifications}
      />
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        courseId={courseData?.id || ""}
        canReview={
          !!Progress?.data &&
          Progress.data.completedLessons === Progress.data.totalLessons
        }
      />
      <CourseProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        current={Progress?.data?.completedLessons || 0}
        total={Progress?.data?.totalLessons || 0}
      />
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={userData}
        isLoading={isLoadingUser}
      />
    </header>
  );
}
