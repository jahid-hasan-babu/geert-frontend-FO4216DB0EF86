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
import { courseData, notificationsData } from "@/utils/dummyData";
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUserData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  console.log("User Data >>>", userData)

  let courseTitle: string | null = null;
  if (pathname.startsWith("/courses/")) {
    const slug = pathname.split("/")[2];
    const course = courseData.find((c) => c.slug === slug);
    courseTitle = course?.title || null;
  }

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="cursor-pointer flex items-center justify-center">
          <Image src={logo} alt="Logo" />
        </Link>

        {courseTitle ? (
          <div className="w-full px-4 flex justify-between items-center">
            <div className="text-[24px] font-medium font-playfairDisplay text-[#101010]">
              {courseTitle}
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

          {/* Profile */}
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
          {/* Logo + Close */}
          <div className="flex justify-between items-center">
            <Image src={logo} alt="Logo" width={120} height={36} />
            <button onClick={() => setIsOpen(false)} aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          {courseTitle ? (
            <h1 className="text-lg font-semibold">{courseTitle}</h1>
          ) : (
            <ul className="flex flex-col space-y-4 text-gray-800 font-medium">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block ${isActive(href) ? "text-[#3399CC] font-semibold" : "hover:text-[#9191c4]"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Mobile Profile + Notification */}
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
      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
      <CourseProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        current={12}
        total={18}
      />
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={userData}
      />
    </header>
  );
}
