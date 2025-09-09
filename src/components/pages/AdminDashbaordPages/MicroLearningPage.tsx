"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CourseCard from "@/components/ui/card/CourseCard";
import Link from "next/link";
import { useGetMicroLearningQuery } from "@/redux/features/courses/coursesApi";
import { Skeleton } from "antd";
import { Course } from "@/components/ui/modal/add-lesson-modal";

const MicroLearningPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const { data, isLoading } = useGetMicroLearningQuery(searchTerm);
	const currentCourses = data?.data?.data;
	console.log(currentCourses, "micro-learning all courses list");

	return (
		<>
			<div className="min-h-screen bg-white p-6">
				<div className="mx-auto mb-6">
					<div className="flex items-center justify-between mb-6">
						<div className="relative flex-1 max-w-5xl">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								type="text"
								placeholder="Search here"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
								}}
								className="pl-10"
							/>
						</div>
						<Link href="/dashboard/micro-learning/add-microLearning">
							<button className="bg-[#3399CC] text-white px-2 lg:px-4 py-[5px] lg:py-[10px] text-xs lg:text-sm rounded-full font-semibold transition-colors duration-200 shadow-lg cursor-pointer font-sans" data-translate>
								+ Add Microlearning
							</button>
						</Link>
					</div>

					<div>
						{isLoading ? (
							<Skeleton active />
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{currentCourses?.map((course: Course) => (
									<CourseCard key={course.id} course={course} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default MicroLearningPage;