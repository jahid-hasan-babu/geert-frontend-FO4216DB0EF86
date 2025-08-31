"use client";

import { useState, useEffect } from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton/PrimaryButton";
import CourseCard from "@/components/ui/card/CourseCard";
import Link from "next/link";
import axios from "axios";
import { Skeleton } from "antd";

interface APICourse {
	id: string;
	title: string;
	slug?: string;
	coverImage?: string;
	duration?: string;
	totalLessons?: number;
	avgRating?: number;
	category?: string;
	type?: string;
	completed?: number;
	isBestseller?: boolean;
	lessons?: number;
	isMicroLearning?: boolean;
	description?: string;
}

export default function HomeCourse() {
	const [courses, setCourses] = useState<APICourse[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchCourses = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_BASE_URL}/courses/all-course`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setCourses(res?.data?.data?.data);
		} catch (err) {
			console.error("Failed to fetch courses:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCourses();
	}, []);

	return (
		<section className="pb-16 lg:pb-24">
			<div className="container mx-auto px-6">
				{/* Header */}
				<div className="flex justify-between items-center mb-6 lg:mb-12">
					<h2 className="text-center lg:text-left text-3xl md:text-4xl lg:text-5xl text-gray-900 font-playfairDisplay font-semibold">
						Start Learning Something Today
					</h2>
					<div className="hidden md:block">
						<Link href="/courses">
							<PrimaryButton label="View All Course" />
						</Link>
					</div>
				</div>

				{/* Course Cards */}
				<div>
					{loading ? (
						<Skeleton active />
					) : (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
							{courses.length > 0 ? (
								courses.slice(0, 6).map((course) => (
									<div key={course.id}>
										<Link href={`/courses/${course.id}`}>
											<CourseCard
												course={{
													id: course?.id,
													title: course?.title,
													slug: course?.slug || course?.id, // fallback to id if slug not available
													coverImage: course?.coverImage || "",
													duration: course?.duration || "",
													lessons: course?.totalLessons || 0,
													rating: course?.avgRating || 0,
													category: course?.category || "",
													type: course?.type || "video",
													completed: course?.completed || 0,
													isBestseller: course?.isBestseller || false,
													isMicroLearning: course?.isMicroLearning || false,
													description: course?.description || "",
													courseContexts: [], // required by CourseCard
												}}
											/>
										</Link>
									</div>
								))
							) : (
								<div className="col-span-full text-center text-gray-500">
									No courses found
								</div>
							)}
						</div>
					)}
				</div>

				{/* Mobile Button */}
				<div className="mt-8 md:hidden">
					<Link href="/courses">
						<PrimaryButton label="View All Course" className="w-full" />
					</Link>
				</div>
			</div>
		</section>
	);
}
