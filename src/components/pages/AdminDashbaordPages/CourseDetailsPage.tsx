"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import AddMemberModal from "@/components/ui/modals/AddMemberModal";
import { Button } from "@/components/ui/button";
import course_image from "@/assets/images/course_image.png";
import { Loader2 } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  Quiz: string[];
}

interface Instructor {
  id: string;
  username: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  duration: string;
  category: Category;
  price: number;
  avgRating: number;
  isMicroLearning: boolean;
  instructor: Instructor;
  modules: Module[];
  totalStudents: number;
}

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/single-course/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(res.data.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchCourse();
  }, [id, fetchCourse]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-10">Course not found.</div>;
  }

  return (
    <div className="mx-auto bg-white p-6">
      {/* Breadcrumb + Add Member */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="bg-white py-[10px] px-[12px] flex space-x-[4px] text-[14px]">
            <div className="text-[#3399CC]">Course</div>
            <div>/</div>
            <div>Course Details</div>
          </div>
        </div>
        <AddMemberModal
          courseId={course.id}
          onAddSuccess={() => fetchCourse()}
        />
      </div>

      {/* Cover Image */}
      <div className="w-full h-48 relative mb-8">
        <Image
          src={course.coverImage || course_image}
          alt={course.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Course Info */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-6">Course Details</h1>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <Input value={course.title} className="bg-gray-50" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={course.description}
              className="bg-gray-50 min-h-[80px]"
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Category
              </label>
              <Input
                value={course.category.name}
                className="bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Duration
              </label>
              <div className="relative">
                <Input
                  value={course.duration}
                  className="bg-gray-50 pr-10"
                  readOnly
                />
                <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Module</h2>
        <Accordion type="single" collapsible className="space-y-2 pb-5">
          {course.modules.map((module, index) => (
            <AccordionItem
              key={module.id}
              value={`module-${module.id}`}
              className="border border-gray-200 rounded-lg"
            >
              <AccordionTrigger className="px-4 py-3 text-left hover:no-underline cursor-pointer">
                <span className="text-gray-700 font-medium font-sans">
                  Module {index + 1}: {module.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  {module.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="p-2 border rounded-md bg-gray-50"
                    >
                      <p className="text-gray-800 font-medium">
                        {index + 1}.{idx + 1} {lesson.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lesson.type === "video"
                          ? `🎥 ${lesson.duration}`
                          : `📝 ${lesson.duration}`}
                      </p>
                    </div>
                  ))}
                  {module.Quiz.length > 0 && (
                    <div className="p-2 border rounded-md bg-yellow-50">
                      Quiz Available: {module.Quiz.length}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          {/* Certification */}
          <AccordionItem
            value="certification"
            className="border border-gray-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 text-left hover:no-underline cursor-pointer">
              <span className="text-gray-700 font-medium font-sans">
                Certification
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <p className="text-gray-600">
                You’ll receive a certificate after completing all lessons and
                quizzes.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Instructor Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Instructor Info</h2>
        {course.instructor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor Name
              </label>
              <Input
                value={course.instructor.username}
                className="bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                value={course.instructor.email}
                className="bg-gray-50"
                readOnly
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            No instructor assigned for this course.
          </p>
        )}
      </div>

      {/* Edit Button */}
      <div className="mb-8">
        <Button className="w-full bg-[#3399CC] hover:bg-[#52b9ec] text-white py-3 rounded-lg cursor-pointer">
          Edit
        </Button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
