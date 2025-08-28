"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeComponent from "@/components/pages/landingPage/HomeComponent";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
   
    if (user?.role === "STUDENT") {
      router.push("/");
    }
  }, [router]);

  return <HomeComponent />;
};

export default HomePage;
