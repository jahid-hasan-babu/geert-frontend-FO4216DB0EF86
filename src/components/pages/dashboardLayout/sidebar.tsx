"use client";

import {
  LogOut,
  Menu,
  Contact,
  CircleUserRound,
  Users,
  UserCog,
  Bell,
  LayoutDashboard,
  Layers,
  Podcast,
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import Link from "next/link";
import { useState, memo } from "react";
import { logoutHandler } from "@/utils/handleLogout";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPageContentsOpen, setIsPageContentsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  type NavItemProps = {
    href?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
    onClick?: () => void;
    isDropdown?: boolean;
    isOpen?: boolean;
    activeOverride?: boolean;
  };

  const NavItem = memo(function NavItem({
    href,
    icon: Icon,
    children,
    onClick,
    isDropdown = false,
    isOpen = false,
    activeOverride = false,
  }: NavItemProps) {
    const active = activeOverride || (href ? isActive(href) : false);

    const content = (
      <>
        {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
        <span className="flex-1">{children}</span>
        {isDropdown &&
          (isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ))}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={`flex items-center px-3 py-2 text-sm md:text-base rounded-md transition-colors cursor-pointer
          ${active ? "text-blue-600 bg-blue-100" : "text-gray-600"} 
          hover:text-gray-900 hover:bg-gray-100`}
        >
          {content}
        </Link>
      );
    }

    return (
      <div
        onClick={onClick}
        className={`flex items-center px-3 py-2 text-sm md:text-base rounded-md transition-colors cursor-pointer
        ${active ? "text-blue-600 bg-blue-100" : "text-gray-600"} 
        hover:text-gray-900 hover:bg-gray-100`}
      >
        {content}
      </div>
    );
  });

  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutHandler(dispatch);
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <>
      {/* Mobile toggle button */}
      <TranslateInitializer/>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="h-16 px-6 flex items-center justify-center"
          >
            <div className="flex items-center justify-center gap-3">
              <Image
                src={logo}
                alt="Logo"
                className="flex-shrink-0 w-[150px]"
              />
            </div>
          </Link>

          {/* Nav items */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              <NavItem href="/dashboard" icon={LayoutDashboard}>
                <div data-translate>Dashboard</div>
              </NavItem>
              <NavItem href="/dashboard/course" icon={Contact}>
                <div data-translate>Course</div>
              </NavItem>
              <NavItem href="/dashboard/category" icon={Layers}>
                <div data-translate>Category</div>
              </NavItem>
              <NavItem href="/dashboard/micro-learning" icon={CircleUserRound}>
                <div data-translate>MicroLearning</div>
              </NavItem>
              <NavItem href="/dashboard/students" icon={Users}>
                <div data-translate>Students</div>
              </NavItem>
              <NavItem href="/dashboard/instructor" icon={UserCog}>
                <div data-translate>Instructor</div>
              </NavItem>
              <NavItem href="/dashboard/subscriber" icon={Podcast}>
                <div data-translate>Subscribers</div>
              </NavItem>

              {/* Dropdown */}
              <NavItem
                icon={BookOpenCheck}
                isDropdown
                isOpen={isPageContentsOpen}
                onClick={() => setIsPageContentsOpen(!isPageContentsOpen)}
                activeOverride={pathname.startsWith("/dashboard/page-contents")}
              >
                <div data-translate>Page Contents</div>
              </NavItem>

              {/* Dropdown links */}
              <div
                key="page-contents-dropdown"
                className={`ml-8 overflow-hidden transition-all duration-300 ease-in-out ${
                  isPageContentsOpen ? "max-h-60 space-y-3" : "max-h-0"
                }`}
              >
                <Link
                  href="/dashboard/page-contents/home-page"
                  className={`block text-sm py-1 px-2 rounded ${
                    isActive("/dashboard/page-contents/home")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div data-translate>Home Page</div>
                </Link>
                <Link
                  href="/dashboard/page-contents/privacy-policy"
                  className={`block text-sm py-1 px-2 rounded ${
                    isActive("/dashboard/page-contents/privacy-policy")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div data-translate>Privacy Policy</div>
                </Link>
                <Link
                  href="/dashboard/page-contents/terms-service"
                  className={`block text-sm py-1 px-2 rounded ${
                    isActive("/dashboard/page-contents/terms-service")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div data-translate>Terms of Service</div>
                </Link>
                <Link
                  href="/dashboard/page-contents/cookie-policy"
                  className={`block text-sm py-1 px-2 rounded ${
                    isActive("/dashboard/page-contents/cookie-policy")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div data-translate>Cookie Policy</div>
                </Link>
                <Link
                  href="/dashboard/page-contents/regulatory-information"
                  className={`block text-sm py-1 px-2 rounded ${
                    isActive("/dashboard/page-contents/regulatory-information")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div data-translate>Regulatory Information</div>
                </Link>
                <Link
                  href="/dashboard/page-contents/help-support"
                  className={`block text-sm py-1 px-2 rounded ${
                    isActive("/dashboard/page-contents/help-support")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div data-translate>Help & Support</div>
                </Link>
              </div>

              <NavItem href="/dashboard/notifications" icon={Bell}>
                <div data-translate>Notification</div>
              </NavItem>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="space-y-1">
              <NavItem>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center cursor-pointer"
                >
                  <LogOut size={35} className="h-5 w-5 mr-3" />
                  <span className="text-sm md:text-base text-gray-600" data-translate>
                    Logout
                  </span>
                </button>
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
