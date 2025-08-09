"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeComponent from "@/components/pages/landingPage/HomeComponent";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      router.push("/auth/login");
    }
  }, [router]);

  return <HomeComponent />;
};

export default HomePage;
