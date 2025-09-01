"use client";

import { DropdownMenu, DropdownMenuTrigger } from "./dropdown-menu";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();

  // Map your base routes to titles
  const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/course": "Courses",
    "/dashboard/micro-learning": "MicroLearning",
    "/dashboard/students": "Students",
    "/dashboard/instructor": "Instructors",
    "/dashboard/notifications": "Notifications",
    "/settings": "Settings",
  };

  const getPageTitle = () => {
    // Handle "startsWith" cases for parent routes
    if (pathname.startsWith("/dashboard/instructor")) return "Instructors";
    if (pathname.startsWith("/dashboard/course")) return "Courses";
    if (pathname.startsWith("/dashboard/students")) return "Students";
    if (pathname.startsWith("/dashboard/micro-learning"))
      return "MicroLearning";

    // Exact matches
    if (routeTitles[pathname]) return routeTitles[pathname];

    // Fallback: format last segment
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 0
      ? parts[parts.length - 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Overview";
  };

  return (
    <nav className="px-3 sm:px-12 flex items-center justify-between bg-white h-full">
      <div className="font-medium text-2xl hidden lg:flex truncate max-w-[300px]">
        {getPageTitle()}
      </div>

      <div className="flex items-center gap-2 ml-auto lg:ml-0">
        {/* <NotificationDetails /> */}

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="User avatar"
                width={28}
                height={28}
                className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-9 sm:h-9 cursor-pointer"
              />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </nav>
  );
}
