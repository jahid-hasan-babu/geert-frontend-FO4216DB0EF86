"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bell, ChevronDown, Star, X } from "lucide-react";
import axios from "axios";
import logo from "@/assets/images/logo.png";
import profile_dp from "@/assets/images/profile_dp.png";
import { notificationsData } from "@/utils/dummyData";
import NotificationModal from "@/components/ui/modals/NotificationModal";
import { ReviewModal } from "@/components/ui/modals/ReviewModal";
import { CourseProgressModal } from "@/components/ui/modals/CourseProgressModal";
import { MenuModal } from "@/components/ui/modals/MenuModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
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

interface MyCourse {
  id: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [courseData, setCourseData] = useState<MyCourse | null>(null);

  const pathname = usePathname();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) setUserData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch "My Courses" and get the matching course based on pathname
  useEffect(() => {
    const fetchCourse = async () => {
      if (!pathname.startsWith("/courses/")) {
        setCourseData(null);
        return;
      }

      const courseId = pathname.split("/")[2];
      if (!courseId) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/my-course`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          const courses: MyCourse[] = res.data.data.data;
          const course = courses.find((c) => c.id === courseId);
          setCourseData(course || null);
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
      }
    };
    fetchCourse();
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="cursor-pointer flex items-center justify-center"
        >
          <Image src={logo} alt="Logo" />
        </Link>

        {/* Course Page Header */}
        {courseData ? (
          <div className="w-full px-4 flex justify-between items-center">
            <div className="text-[24px] font-medium font-playfairDisplay text-[#101010]">
              {courseData.title}
            </div>
            <div className="flex items-center space-x-[12px]">
              <button
                onClick={() => setIsReviewOpen(true)}
                className="flex items-center space-x-2 font-sans"
              >
                <Star className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium leading-[120%] cursor-pointer">
                  Leave Review
                </span>
              </button>
				{/* Course Page Header */}

				<>
					

						<div className="flex "> 
						
					
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

						{
							pathname === `/courses/${courseData?.id}` || pathname === `/courses/${courseData?.id}/progress` ? (
								<div >
									<div className="w-full px-4 flex justify-between items-center">
							{isLoadingCourse && (
								<Spin indicator={<LoadingOutlined spin />} size="large" />
							) }

							<div className="flex items-center space-x-[12px]">
								<button
									onClick={() => setIsReviewOpen(true)}
									className="flex items-center space-x-2 font-sans"
								>
									<Star className="w-5 h-5 text-gray-500" />
									<span className="text-gray-700 font-medium leading-[120%] cursor-pointer">
										Leave Review
									</span>
								</button>

              <div
                className="flex items-center space-x-2 font-sans cursor-pointer"
                onClick={() => setIsProgressOpen(true)}
              >
                <span className="text-gray-700 font-medium leading-[120%]">
                  Your Progress
                </span>
                <ChevronDown className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </div>
        ) : (
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
        )}
								<div
									className="flex items-center space-x-2 font-sans cursor-pointer"
									onClick={() => setIsProgressOpen(true)}
								>
									<span className="text-gray-700 font-medium leading-[120%]">
										Your Progress
									</span>
									<ChevronDown className="w-6 h-6 text-gray-500" />
								</div>
							</div>
						</div>
								</div>
							) : null
						}
						

					</div>
				

				</>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-5">
          <button
            className="relative p-2 rounded-full bg-[#EBF5FA] transition"
            onClick={() => setIsNotifOpen(true)}
          >
            <Bell className="w-6 h-6 text-[#5F5F5F] cursor-pointer" />
            {notificationsData.length > 0 && (
              <span className="absolute top-2 right-2 block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          <Image
            src={userData?.profileImage || profile_dp}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border border-gray-200 cursor-pointer"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
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
          <div className="flex justify-between items-center">
            <Image src={logo} alt="Logo" width={120} height={36} />
            <button onClick={() => setIsOpen(false)} aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          {courseData ? (
            <h1 className="text-lg font-semibold">{courseData.title}</h1>
          ) : (
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
          )}

          <div className="flex items-center space-x-4 pt-4 border-t">
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setIsNotifOpen(true)}
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {notificationsData.length > 0 && (
                <span className="absolute top-2 right-2 block w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <Image
              src={userData?.profileImage || profile_dp}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border border-gray-200 cursor-pointer"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Modals */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notificationsData}
      />
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        courseId={courseData?.id || ""}
        canReview={
          !!courseData &&
          courseData.completedLessons === courseData.totalLessons
        }
      />

      <CourseProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        current={courseData?.completedLessons || 0}
        total={courseData?.totalLessons || 0}
      />
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={userData}
      />
    </header>
  );
}
