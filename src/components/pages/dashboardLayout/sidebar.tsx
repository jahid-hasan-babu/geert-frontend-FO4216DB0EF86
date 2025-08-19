"use client";

import {
  Settings,
  LogOut,
  Menu,
  Contact,
  CircleUserRound,
  Users,
  UserCog,
  Bell,
  LayoutDashboard,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { logoutHandler } from "@/utils/handleLogout";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  function NavItem({
    href = "#",
    icon: Icon,
    children,
  }: {
    href?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        className={`flex items-center px-3 py-2 text-sm md:text-base rounded-md transition-colors 
        ${isActive(href) ? "text-blue-600 bg-blue-100" : "text-gray-600"} 
        hover:text-gray-900 hover:bg-gray-100`}
      >
        {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
        {children}
      </Link>
    );
  }

  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>
      <nav
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/dashboard"
            className="h-16 px-6 flex items-center justify-center"
          >
            <div className="flex items-center justify-center gap-3">
              <Image
                src={logo}
                alt="Logo"
                className="flex-shrink-0 w-[150px] "
              />
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div className="space-y-[12px]">
                <NavItem href="/dashboard" icon={LayoutDashboard}>
                  Dashboard
                </NavItem>
                <NavItem href="/dashboard/course" icon={Contact}>
                  Course
                </NavItem>
                <NavItem href="/dashboard/microLearning" icon={CircleUserRound}>
                  MicroLearning
                </NavItem>
                <NavItem href="/dashboard/students" icon={Users}>
                  Students
                </NavItem>
                <NavItem href="/dashboard/instructor" icon={UserCog}>
                  Instructor
                </NavItem>
                <NavItem href="/dashboard/notifications" icon={Bell}>
                  Notification
                </NavItem>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200">
            <div className="space-y-1">
              <NavItem href="/settings" icon={Settings}>
                Settings
              </NavItem>
              <NavItem>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center cursor-pointer"
                >
                  <LogOut size={35} className="h-5 w-5 mr-3" />
                  <span className="text-sm md:text-base text-gray-600">
                    Logout
                  </span>
                </button>
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
