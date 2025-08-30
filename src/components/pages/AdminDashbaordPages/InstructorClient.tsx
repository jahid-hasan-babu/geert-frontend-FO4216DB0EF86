"use client";

import { useEffect, useState } from "react";
import { LessonsItem } from "@/components/ui/context/CourseContext";
import axios from "axios";

interface Instructor {
  id: string;
  name: string;
  designation?: string | null;
  profileImage?: string;
  totalCourses: number;
  totalStudents: number;
  totalReviews: number;
  phone: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  courseContexts: LessonsItem[];
  lessons: number;
  duration: string;
  rating: number;
  category: string;
  type: string;
  completed: number;
  isBestseller?: boolean;
  isMicroLearning?: boolean;
  description: string;
  coverImage: string;
}

interface Data {
  instructor: Instructor;
  course: Course[];
}

interface Props {
  id: string;
}

export default function InstructorClient({ id }: Props) {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get<{ data: { data: Data } }>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/single-instructor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data.data.data);
      } catch {
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

  // return <InstructorCourses instructor={data.instructor} courses={data.course} />;
}
