/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Info, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useGetCourseByIdQuery, useEditCourseMutation } from "@/redux/features/courses/coursesApi"
import AddModuleModal from "@/components/ui/modal/add-module-modal"
import { AddLessonModal } from "@/components/ui/modal/add-lesson-modal"

// Use shared types from add-lesson-modal to ensure compatibility
import type { Module, Lesson, Quiz, QuizOption, Question } from "@/components/ui/modal/add-lesson-modal";
import Editor from "@/components/ui/Editor/Editor"

interface Instructor {
  id: string
  username: string
  email: string
}

interface Category {
  id: string
  name: string
}

interface Course {
  id: string
  title: string
  description: string
  coverImage?: string
  duration: string
  category: Category
  price: number
  avgRating: number
  isMicroLearning: boolean
  instructor: Instructor
  modules: Module[]
  totalStudents: number
}

const CourseDetailsPage = () => {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isModuleModalVisible, setIsModuleModalVisible] = useState(false)
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: 0,
  })
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>("")

  const { data, isLoading } = useGetCourseByIdQuery(id)
  const [editCourse, { isLoading: isEditing }] = useEditCourseMutation()

  console.log("Cousers All", data)

  const courseModules = course?.modules;
	useEffect(() => {
		if (data?.data) {
			const courseData = data?.data;
			setCourse(courseData);
			setFormData({
				title: courseData.title,
				description: courseData.description,
				duration: courseData.duration,
				price: courseData.price,
			});
			setPreviewImage(courseData.coverImage || "");
		}
	}, [data]);

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setCoverImageFile(file);
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async () => {
		try {
			const bodyData = {
				title: formData.title,
				description: formData.description,
				duration: formData.duration,
				price: Number(formData.price), // Ensure price is always a number
			};

			if (coverImageFile) {
				// If there's a new image, use FormData but structure bodyData separately
				const submitData = new FormData();
				submitData.append("bodyData", JSON.stringify(bodyData));
				submitData.append("coverImage", coverImageFile);

				await editCourse({
					id: course?.id,
					formData: submitData,
				}).unwrap();
			} else {
				// If no new image, send JSON data with structured bodyData
				await editCourse({
					id: course?.id,
					formData: bodyData,
				}).unwrap();
			}

			// toast({
			// 	title: "Success",
			// 	description: "Course updated successfully!",
			// });

			setIsEditMode(false);
		} catch (error) {
			console.log(error);
			// toast({
			// 	title: "Error",
			// 	description: "Failed to update course. Please try again.",
			// 	variant: "destructive",
			// });
		}
	};

	const handleCancelEdit = () => {
		if (course) {
			setFormData({
				title: course.title,
				description: course.description,
				duration: course.duration,
				price: course.price,
			});
			setPreviewImage(course.coverImage || "");
			setCoverImageFile(null);
		}
		setIsEditMode(false);
	};

	const handleAddModule = () => {
		setIsModuleModalVisible(true);
	};

	const handleAddLesson = () => {
		setIsLessonModalVisible(true);
	};

	const handleModuleSuccess = () => {
		// Refetch course data to show new module
		window.location.reload(); // Simple refresh, could be optimized with RTK Query refetch
	};

	const handleLessonSuccess = () => {
		// Refetch course data to show new lesson
		window.location.reload(); // Simple refresh, could be optimized with RTK Query refetch
	};

	if (isLoading) {
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
			<div className="flex items-center justify-between mb-6">
				<div>
					<div className="bg-white py-[10px] px-[12px] flex space-x-[4px] text-[14px]">
						<div className="text-[#3399CC]">Course</div>
						<div>/</div>
						<div>Course Details</div>
					</div>
				</div>
			</div>

			<div className="w-full h-48 relative mb-8">
				{isEditMode ? (
					<div className="relative">
						<Image
							src={
								previewImage ||
								"/placeholder.svg?height=200&width=800&query=course+education+banner" ||
								"/placeholder.svg" ||
								"/placeholder.svg"
							}
							alt={formData.title}
							fill
							className="object-cover rounded-lg"
						/>
						<label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg cursor-pointer hover:bg-black/60 transition-colors">
							<div className="text-white text-center">
								<Upload className="w-8 h-8 mx-auto mb-2" />
								<span className="text-sm">Upload New Image</span>
							</div>
							<input
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
							/>
						</label>
					</div>
				) : (
					<Image
						src={
							course?.coverImage ||
							"/placeholder.svg?height=200&width=800&query=course+education+banner" ||
							"/placeholder.svg" ||
							"/placeholder.svg"
						}
						alt={course?.title || "Course"}
						fill
						className="object-cover rounded-lg"
					/>
				)}
			</div>

			<div className="mb-8">
				<h1 className="text-2xl font-semibold mb-6">Course Details</h1>
				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Course Title
						</label>
						<Input
							value={isEditMode ? formData.title : course.title}
							className={isEditMode ? "bg-white" : "bg-gray-50"}
							readOnly={!isEditMode}
							onChange={(e) => handleInputChange("title", e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						{/* <Textarea
							value={isEditMode ? formData.description : course.description}
							className={`${
								isEditMode ? "bg-white" : "bg-gray-50"
							} min-h-[80px]`}
							readOnly={!isEditMode}
							onChange={(e) => handleInputChange("description", e.target.value)}
						/> */}
								{isEditMode ? (
  <Editor
    contents={formData.description}
    onSave={(value: string) => handleInputChange("description", value)}
    onBlur={() => {}}
  />
) : (
  <div
    className="bg-gray-50 min-h-[80px] p-2 rounded"
    dangerouslySetInnerHTML={{ __html: course.description || "" }}
  />
)}
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
									value={isEditMode ? formData.duration : course.duration}
									className={`${isEditMode ? "bg-white" : "bg-gray-50"} pr-10`}
									readOnly={!isEditMode}
									onChange={(e) =>
										handleInputChange("duration", e.target.value)
									}
									placeholder="e.g., 12h 30m"
								/>
								<Info className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							</div>
						</div>
					</div>

					{isEditMode && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Course Price ($)
							</label>
							<Input
								type="number"
								value={formData.price}
								className="bg-white"
								onChange={(e) =>
									handleInputChange(
										"price",
										Number.parseFloat(e.target.value) || 0
									)
								}
								placeholder="199"
							/>
						</div>
					)}
				</div>
			</div>

			<div className="mb-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold">Module</h2>
					<div className="flex gap-2">
						<Button
							onClick={handleAddLesson}
							className="bg-green-600 hover:bg-green-700 text-white"
						>
							Add Lesson
						</Button>
						<Button
							onClick={handleAddModule}
							className="bg-blue-600 hover:bg-blue-700 text-white"
						>
							Add Module
						</Button>
					</div>
				</div>
				<Accordion type="single" collapsible className="space-y-2 pb-5">
					{course?.modules?.map((module, index) => (
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
									{module?.lessons?.map((lesson, idx) => (
										<div
											key={lesson.id}
											className="p-2 border rounded-md bg-gray-50"
										>
											<p className="text-gray-800 font-medium">
												{index + 1}.{idx + 1} {lesson.title}
											</p>
											<p className="text-sm text-gray-500">
												{lesson.type === "video"
													? `🎥 ${lesson?.duration}`
													: `📝 ${lesson?.duration}`}
											</p>
										</div>
									))}
									{module?.quizzes?.length > 0 && (
										<div className="p-2 border rounded-md bg-yellow-50">
											Quiz Available: {module?.quizzes?.length}
										</div>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}

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

			<div className="mb-8">
				{isEditMode ? (
					<div className="flex gap-4">
						<Button
							onClick={handleSubmit}
							disabled={isEditing}
							className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
						>
							{isEditing ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
						<Button
							onClick={handleCancelEdit}
							variant="outline"
							className="flex-1 py-3 rounded-lg bg-transparent"
						>
							Cancel
						</Button>
					</div>
				) : (
					<Button
						onClick={() => setIsEditMode(true)}
						className="w-full bg-[#3399CC] hover:bg-[#52b9ec] text-white py-3 rounded-lg cursor-pointer"
					>
						Edit Course
					</Button>
				)}
			</div>

			<AddModuleModal
				visible={isModuleModalVisible}
				onCancel={() => setIsModuleModalVisible(false)}
				courseId={id as string}
				onSuccess={handleModuleSuccess}
			/>

			<AddLessonModal
				visible={isLessonModalVisible}
				onCancel={() => setIsLessonModalVisible(false)}
				courseId={id as string}
				modu={course?.modules as Module[]}
			/>
		</div>
	);
}

export default CourseDetailsPage
