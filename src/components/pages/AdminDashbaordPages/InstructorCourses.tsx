import React from "react";
import CourseCard from "@/components/ui/card/CourseCard";
import { LessonsItem } from "@/components/ui/context/CourseContext";

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

interface Props {
	instructor: Instructor;
	courses: Course[];
}

const InstructorCourses = ({ instructor, courses }: Props) => {
	return (
		<div className="space-y-4">
			{/* Breadcrumb */}
			<div className="bg-white py-[10px] px-[12px] flex space-x-[4px] text-[14px]">
				<div className="text-[#3399CC]">Instructor</div>
				<div>/</div>
				<div>{instructor.name}</div>
			</div>

			{/* Instructor Info */}
			<div className="bg-white p-6">
				<div className="text-xl flex justify-between font-medium">
					<div className="space-y-2">
						<p>{instructor.name}</p>
						<p>{instructor.phone}</p>
						<p>Total Students: {instructor.totalStudents}</p>
					</div>
					<div className="space-y-2 text-right">
						<p>Total Courses: {instructor.totalCourses}</p>
						<p>Total Reviews: {instructor.totalReviews}</p>
					</div>
					<div></div>
				</div>

				{/* Courses */}
				{courses.length === 0 ? (
					<p className="mt-6">No courses assigned.</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
						{courses.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default InstructorCourses;
