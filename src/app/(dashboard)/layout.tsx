"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/pages/dashboardLayout/sidebar";
import TopNav from "@/components/pages/dashboardLayout/top-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.role === "STUDENT") {
          router.replace("/"); // block students from dashboard
          return;
        }
      } catch (err) {
        console.error("Invalid user in localStorage:", err);
        router.replace("/auth/login");
        return;
      }
    }

    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-16 border-b border-gray-200">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-[#F6FCFF]">{children}</main>
      </div>
    </div>
  );
}
