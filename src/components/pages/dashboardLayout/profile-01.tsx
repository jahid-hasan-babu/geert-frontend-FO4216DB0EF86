"use client";

import { logoutHandler } from "@/utils/handleLogout";
import { LogOut, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface Profile01Props {
  name: string;
  email: string;
  avatar: string;
  subscription?: string;
}

interface StoredUser {
  username?: string;
  email?: string;
  profileImage?: string;
}

const defaultProfile: Required<Profile01Props> = {
  name: "Name",
  email: "example@email.com",
  avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  subscription: "Free Trial",
};

export default function Profile01() {
  const [profile, setProfile] = useState<Profile01Props>(defaultProfile);

  const menuItems: MenuItem[] = [];

  // const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed: StoredUser = JSON.parse(storedUser);
        setProfile({
          name: parsed.username || defaultProfile.name,
          email: parsed.email || defaultProfile.email,
          avatar: parsed.profileImage || defaultProfile.avatar,
        });
      } catch {
        console.error("Error parsing user from localStorage");
      }
    }
  }, []);

  const handleLogout = (): void => {
    logoutHandler(dispatch);
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <div className="relative w-full max-w-sm mx-auto z-[100000]">
      <TranslateInitializer/>
      <div className="relative overflow-hidden rounded-lg border border-zinc-200">
        <div className="relative px-6 pt-6 pb-6 z-[999999]">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={28}
                height={28}
                className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-9 sm:h-9 cursor-pointer"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900">
                {profile.name}
              </h2>
              <p className="text-sm text-zinc-600">{profile.email}</p>
            </div>
          </div>

          <div className="h-px bg-zinc-200 my-3" />
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 
                  hover:bg-zinc-50 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm lg:text-base font-medium text-zinc-700">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center">
                  {item.value && (
                    <span className="text-sm text-zinc-500 mr-2">
                      {item.value}
                    </span>
                  )}
                  {item.external && <MoveUpRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-2 
                hover:bg-zinc-50 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm lg:text-base font-medium text-zinc-700" data-translate>
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}