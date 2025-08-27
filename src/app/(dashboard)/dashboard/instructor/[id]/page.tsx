"use client";

import { use, useEffect, useState } from "react";
import InstructorCourses from "@/components/pages/AdminDashbaordPages/InstructorCourses";
import axios from "axios";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/single-instructor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Respose >>", res)
        setData(res?.data.data?.data);
      } catch (error) {
        setError("Failed to load instructor");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No data found</p>;

  return <InstructorCourses instructor={data.instructor} courses={data.course} />;
}
