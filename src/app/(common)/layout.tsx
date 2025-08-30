"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/shared/Footer/Footer";
import NavBar from "@/components/shared/NavBar/navComponent/NavBar";
import { ReactNode } from "react";

const CommonLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  return (
    <div>
      <div className="h-full min-h-[calc(100vh-0px)]">
        <NavBar />
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default CommonLayout;
