// InstructorCourses.tsx
import React from "react";
import { courseData } from "@/utils/dummyData";
import { Lesson } from "@/components/ui/context/CourseContext";
import CourseCard from "@/components/ui/card/CourseCard";

interface Course {
  id: string;
  title: string;
  slug: string;
  lessonsList: Lesson[];
  lessons: number;
  duration: string;
  rating: number;
  category: string;
  type: string;
  completed: number;
  isBestseller?: boolean;
  isMicro?: boolean;
  description: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  expertise: string;
  status: string;
  assignedCoursesId: string[];
}

interface Props {
  instructor: Instructor;
}

const InstructorCourses = ({ instructor }: Props) => {
  const assignedCourses: Course[] = courseData.filter((course) =>
    instructor.assignedCoursesId.includes(course.id.toString())
  );

  return (
    <>
      <div className="bg-white p-6">
        <div className="text-xl flex justify-between font-medium">
          <div className="space-y-2">
            <p>{instructor.name}</p>
            <p>Phone: {instructor.phone}</p>
            <p>Email: {instructor.email}</p>
          </div>
          <div className="space-y-2">
            <p>Total Course: {assignedCourses.length}</p>
            <p>Total Review: </p>
          </div>
          <div></div>
        </div>

        {assignedCourses.length === 0 ? (
          <p>No courses assigned.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 h-1/4">
              {assignedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default InstructorCourses;
