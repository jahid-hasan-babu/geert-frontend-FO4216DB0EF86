
import React from "react";
import InstructorClient from "@/components/pages/AdminDashbaordPages/InstructorClient";

// Server component version (recommended for Next.js 15)
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <InstructorClient id={id} />;
};

export default Page;