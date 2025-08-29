/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
	Modal,
	Button as AntButton,
	message,
	Upload,
	Input,
	Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAddCourseModuleMutation } from "@/redux/features/courses/coursesApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import Editor from "@/components/ui/Editor/Editor";
import { usePathname } from "next/navigation";

const { Option } = Select;

interface QuizOption {
	text: string;
	isCorrect: boolean;
	files?: File[];
	fileNames?: string[];
}

interface QuizQuestion {
	text: string;
	type: "SINGLE_CHOICE" | "MULTI_CHOICE" | "ORDERING" | "SCALE" | "TEXT";
	options: QuizOption[];
	scaleMin?: number;
	scaleMax?: number;
}

interface Quiz {
	title: string;
	questions: QuizQuestion[];
}

interface Lesson {
	lessonType: "video" | "doc";
	lessonTitle: string;
	lessonDescription: string;
	lessonDuration: string;
	lessonVideoName: string;
	lessonDocumentFile?: File;
	lessonVideoFile?: File;
	videoUrl?: string;
	uploadProgress?: number;
	isUploading?: boolean;
}

interface ModuleData {
	moduleTitle: string;
	lessons: Lesson[];
	quizzes: Quiz[];
}

interface AddModuleModalProps {
	visible: boolean;
	onCancel: () => void;
	courseId: string;
	onSuccess?: () => void;
}

export default function AddModuleModal({
	visible,
	onCancel,
	courseId,
	onSuccess,
}: AddModuleModalProps) {
	const [addCourseModule, { isLoading }] = useAddCourseModuleMutation();
	const pathname = usePathname();
	const [moduleData, setModuleData] = useState<ModuleData>({
		moduleTitle: "",
		lessons: [
			{
				lessonType: "video",
				lessonTitle: "",
				lessonDescription: "",
				lessonDuration: "",
				lessonVideoName: "",
				videoUrl: "",
			},
		],
		quizzes: [],
	});

	const handleSubmit = async () => {
		try {
			// Validate required fields
			if (!moduleData.moduleTitle.trim()) {
				message.error("Module title is required");
				return;
			}

			if (
				moduleData.lessons.some(
					(lesson) =>
						!lesson.lessonTitle.trim() || !lesson.lessonDuration.trim()
				)
			) {
				message.error("All lesson titles and durations are required");
				return;
			}

			// Create FormData for submission
			const formData = new FormData();

			// Add module data as JSON
			const moduleInfo = {
				moduleTitle: moduleData.moduleTitle,
				lessons: moduleData.lessons.map((lesson) => ({
					lessonType: lesson.lessonType,
					lessonTitle: lesson.lessonTitle,
					lessonDescription: lesson.lessonDescription,
					lessonDuration: lesson.lessonDuration,
					videoUrl: lesson.videoUrl || "",
				})),
				quizzes: moduleData.quizzes,
			};

			formData.append("moduleData", JSON.stringify(moduleInfo));

			// Add video files if any
			moduleData.lessons.forEach((lesson, index) => {
				if (lesson.lessonVideoFile) {
					formData.append(`lessonVideo_${index}`, lesson.lessonVideoFile);
				}
				if (lesson.lessonDocumentFile) {
					formData.append(`lessonDocument_${index}`, lesson.lessonDocumentFile);
				}
			});

			await addCourseModule({
				id: courseId,
				formData,
			}).unwrap();

			message.success("Module added successfully!");
			onSuccess?.();
			handleCancel();
		} catch (error) {
			console.error("Error adding module:", error);
			message.error("Failed to add module. Please try again.");
		}
	};

	const handleCancel = () => {
		setModuleData({
			moduleTitle: "",
			lessons: [
				{
					lessonType: "video",
					lessonTitle: "",
					lessonDescription: "",
					lessonDuration: "",
					lessonVideoName: "",
					videoUrl: "",
				},
			],
			quizzes: [],
		});
		onCancel();
	};

	const addLesson = () => {
		setModuleData((prev) => ({
			...prev,
			lessons: [
				...prev.lessons,
				{
					lessonType: "video",
					lessonTitle: "",
					lessonDescription: "",
					lessonDuration: "",
					lessonVideoName: "",
					videoUrl: "",
				},
			],
		}));
	};

	const removeLesson = (index: number) => {
		if (moduleData.lessons.length > 1) {
			setModuleData((prev) => ({
				...prev,
				lessons: prev.lessons.filter((_, i) => i !== index),
			}));
		}
	};

	const updateLesson = (index: number, field: keyof Lesson, value: any) => {
		setModuleData((prev) => ({
			...prev,
			lessons: prev.lessons.map((lesson, i) =>
				i === index ? { ...lesson, [field]: value } : lesson
			),
		}));
	};

	const handleVideoUpload = (index: number, file: File) => {
		updateLesson(index, "lessonVideoFile", file);
		updateLesson(index, "lessonVideoName", file.name);
		updateLesson(index, "isUploading", true);
		updateLesson(index, "uploadProgress", 0);

		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.random() * 15 + 5;
			if (progress >= 100) {
				progress = 100;
				clearInterval(interval);
				updateLesson(index, "isUploading", false);
				updateLesson(index, "uploadProgress", 100);
				message.success("Video uploaded successfully!");
			}
			updateLesson(index, "uploadProgress", Math.min(progress, 100));
		}, 200 + Math.random() * 300);

		return false; // Prevent default upload behavior
	};

	const handleDocumentUpload = (index: number, file: File) => {
		updateLesson(index, "lessonDocumentFile", file);
		updateLesson(index, "lessonVideoName", file.name);
		message.success("Document uploaded successfully!");
		return false;
	};

	const addQuiz = () => {
		setModuleData((prev) => ({
			...prev,
			quizzes: [
				...prev.quizzes,
				{
					title: "",
					questions: [
						{
							text: "",
							type: "SINGLE_CHOICE",
							options: [
								{ text: "", isCorrect: true },
								{ text: "", isCorrect: false },
								{ text: "", isCorrect: false },
							],
						},
					],
				},
			],
		}));
	};

	const removeQuiz = (index: number) => {
		setModuleData((prev) => ({
			...prev,
			quizzes: prev.quizzes.filter((_, i) => i !== index),
		}));
	};

	const addQuizQuestion = (quizIndex: number) => {
		setModuleData((prev) => ({
			...prev,
			quizzes: prev.quizzes.map((quiz, i) =>
				i === quizIndex
					? {
							...quiz,
							questions: [
								...quiz.questions,
								{
									text: "",
									type: "SINGLE_CHOICE",
									options: [
										{ text: "", isCorrect: true },
										{ text: "", isCorrect: false },
									],
								},
							],
					  }
					: quiz
			),
		}));
	};

	const removeQuizQuestion = (quizIndex: number, questionIndex: number) => {
		setModuleData((prev) => ({
			...prev,
			quizzes: prev.quizzes.map((quiz, i) =>
				i === quizIndex
					? {
							...quiz,
							questions: quiz.questions.filter((_, j) => j !== questionIndex),
					  }
					: quiz
			),
		}));
	};

	const updateQuizQuestion = (
		quizIndex: number,
		questionIndex: number,
		field: string,
		value: any
	) => {
		setModuleData((prev) => ({
			...prev,
			quizzes: prev.quizzes.map((quiz, i) =>
				i === quizIndex
					? {
							...quiz,
							questions: quiz.questions.map((question, j) =>
								j === questionIndex ? { ...question, [field]: value } : question
							),
					  }
					: quiz
			),
		}));
	};

	const addQuizOption = (quizIndex: number, questionIndex: number) => {
		setModuleData((prev) => ({
			...prev,
			quizzes: prev.quizzes.map((quiz, i) =>
				i === quizIndex
					? {
							...quiz,
							questions: quiz.questions.map((question, j) =>
								j === questionIndex
									? {
											...question,
											options: [
												...question.options,
												{ text: "", isCorrect: false },
											],
									  }
									: question
							),
					  }
					: quiz
			),
		}));
	};

	const removeQuizOption = (
		quizIndex: number,
		questionIndex: number,
		optionIndex: number
	) => {
		setModuleData((prev) => ({
			...prev,
			quizzes: prev.quizzes.map((quiz, i) =>
				i === quizIndex
					? {
							...quiz,
							questions: quiz.questions.map((question, j) =>
								j === questionIndex
									? {
											...question,
											options: question.options.filter(
												(_, k) => k !== optionIndex
											),
									  }
									: question
							),
					  }
					: quiz
			),
		}));
	};

	const updateQuizOption = (
		quizIndex: number,
		questionIndex: number,
		optionIndex: number,
		field: string,
		value: any
	) => {
		setModuleData((prev) => ({
			...prev,
			quizzes: prev.quizzes.map((quiz, i) =>
				i === quizIndex
					? {
							...quiz,
							questions: quiz.questions.map((question, j) =>
								j === questionIndex
									? {
											...question,
											options: question.options.map((option, k) =>
												k === optionIndex
													? { ...option, [field]: value }
													: option
											),
									  }
									: question
							),
					  }
					: quiz
			),
		}));
	};

	const handleLessonDescriptionChange = (
		lessonIndex: number,
		content: string
	) => {
		updateLesson(lessonIndex, "lessonDescription", content);
	};

	return (
		<Modal
			title="Add New Module"
			open={visible}
			onCancel={handleCancel}
			width={900}
			footer={[
				<AntButton key="cancel" onClick={handleCancel}>
					Cancel
				</AntButton>,
				<AntButton
					key="submit"
					type="primary"
					loading={isLoading}
					onClick={handleSubmit}
				>
					Add Module
				</AntButton>,
			]}
		>
			<div className="space-y-6 max-h-[70vh] overflow-y-auto">
				{/* Module Title */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Module Title *
					</label>
					<Input
						placeholder="Enter module title"
						value={moduleData.moduleTitle}
						onChange={(e) =>
							setModuleData((prev) => ({
								...prev,
								moduleTitle: e.target.value,
							}))
						}
					/>
				</div>

				{/* Lessons */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h4 className="font-medium text-gray-700">Lessons</h4>
						<Button onClick={addLesson} variant="outline" size="sm">
							<Plus className="w-4 h-4 mr-2" />
							Add Lesson
						</Button>
					</div>

					{moduleData.lessons.map((lesson, index) => (
						<Card key={index} className="border border-gray-200">
							<CardContent className="p-4 space-y-3">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									<Input
										placeholder="Lesson Title *"
										value={lesson.lessonTitle}
										onChange={(e) =>
											updateLesson(index, "lessonTitle", e.target.value)
										}
									/>
									<Input
										placeholder="Duration (e.g., 5m) *"
										value={lesson.lessonDuration}
										onChange={(e) =>
											updateLesson(index, "lessonDuration", e.target.value)
										}
									/>
									<Select
										value={lesson.lessonType}
										onChange={(value) =>
											updateLesson(index, "lessonType", value)
										}
										placeholder="Lesson Type *"
									>
										<Option value="video">Video</Option>
										<Option value="doc">Document</Option>
									</Select>
								</div>

								{lesson.lessonType === "doc" && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Lesson Description
										</label>
										<Editor
											contents={lesson.lessonDescription}
											onSave={(content) =>
												handleLessonDescriptionChange(index, content)
											}
											onBlur={() => {}}
										/>
									</div>
								)}

								{lesson.lessonType === "video" && (
									<div className="space-y-3">
										<Input
											placeholder="Video URL"
											value={lesson.videoUrl}
											onChange={(e) =>
												updateLesson(index, "videoUrl", e.target.value)
											}
										/>

										<div className="flex items-center gap-3">
											<Upload
												beforeUpload={(file) => handleVideoUpload(index, file)}
												accept="video/*"
												showUploadList={false}
												disabled={lesson.isUploading}
											>
												<AntButton
													icon={<UploadOutlined />}
													disabled={lesson.isUploading}
												>
													{lesson.isUploading ? "Uploading..." : "Upload Video"}
												</AntButton>
											</Upload>

											{lesson.lessonVideoName && (
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-700 bg-white px-3 py-1 rounded border font-medium">
														📹 {lesson.lessonVideoName}
													</span>
													{lesson.isUploading && (
														<span className="text-xs text-blue-600 font-medium">
															{Math.round(lesson.uploadProgress || 0)}%
														</span>
													)}
												</div>
											)}
										</div>

										{lesson.isUploading &&
											lesson.uploadProgress !== undefined && (
												<div className="space-y-1">
													<div className="w-full bg-gray-200 rounded-full h-2">
														<div
															className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
															style={{ width: `${lesson.uploadProgress}%` }}
														/>
													</div>
													<p className="text-xs text-gray-600">
														Uploading video...{" "}
														{Math.round(lesson.uploadProgress)}% complete
													</p>
												</div>
											)}
									</div>
								)}

								{lesson.lessonType === "doc" && (
									<div className="space-y-2">
										<div className="flex items-center gap-3">
											<Upload
												beforeUpload={(file) =>
													handleDocumentUpload(index, file)
												}
												accept=".pdf,.doc,.docx,.txt"
												showUploadList={false}
											>
												<AntButton icon={<UploadOutlined />}>
													Upload Document
												</AntButton>
											</Upload>
											{lesson.lessonVideoName && (
												<span className="text-sm text-gray-700 bg-white px-3 py-1 rounded border font-medium">
													📄 {lesson.lessonVideoName}
												</span>
											)}
										</div>
									</div>
								)}

								{moduleData.lessons.length > 1 && (
									<div className="flex justify-end">
										<Button
											variant="outline"
											size="sm"
											onClick={() => removeLesson(index)}
										>
											<Trash2 className="w-4 h-4 mr-2" />
											Remove Lesson
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>

				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h4 className="font-medium text-gray-700">Quizzes (Optional)</h4>
						<Button onClick={addQuiz} variant="outline" size="sm">
							<Plus className="w-4 h-4 mr-2" />
							Add Quiz
						</Button>
					</div>

					{moduleData.quizzes.map((quiz, quizIndex) => (
						<Card key={quizIndex} className="border border-blue-200 bg-blue-50">
							<CardContent className="p-4 space-y-3">
								<div className="flex items-center gap-3">
									<Input
										placeholder="Quiz Title *"
										value={quiz.title}
										onChange={(e) => {
											setModuleData((prev) => ({
												...prev,
												quizzes: prev.quizzes.map((q, i) =>
													i === quizIndex ? { ...q, title: e.target.value } : q
												),
											}));
										}}
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() => removeQuiz(quizIndex)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>

								<div className="flex justify-end">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => addQuizQuestion(quizIndex)}
									>
										<Plus className="w-3 h-3 mr-1" />
										Add Question
									</Button>
								</div>

								{quiz.questions.map((question, questionIndex) => (
									<div
										key={questionIndex}
										className="space-y-3 p-4 bg-white rounded border"
									>
										<div className="flex items-center gap-3">
											<Input
												placeholder="Question Text *"
												value={question.text}
												onChange={(e) =>
													updateQuizQuestion(
														quizIndex,
														questionIndex,
														"text",
														e.target.value
													)
												}
												className="flex-1"
											/>
											<Select
												value={question.type}
												onChange={(value) =>
													updateQuizQuestion(
														quizIndex,
														questionIndex,
														"type",
														value
													)
												}
												className="w-48"
											>
												<Option value="SINGLE_CHOICE">Single Choice</Option>
												{pathname ===
													"/dashboard/micro-learning/add-microLearning" && (
													<>
														<Option value="MULTI_CHOICE">Multi Choice</Option>
														<Option value="ORDERING">Ordering</Option>
														<Option value="SCALE">Scale</Option>
														<Option value="TEXT">Text Answer</Option>
													</>
												)}
											</Select>
											{quiz.questions.length > 1 && (
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														removeQuizQuestion(quizIndex, questionIndex)
													}
												>
													<Trash2 className="w-3 h-3" />
												</Button>
											)}
										</div>

										{/* Question Options */}
										{question.type === "SINGLE_CHOICE" && (
											<div className="space-y-2">
												<div className="flex justify-between items-center">
													<label className="text-sm font-medium text-gray-700">
														Answer Options:
													</label>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															addQuizOption(quizIndex, questionIndex)
														}
													>
														<Plus className="w-3 h-3 mr-1" />
														Add Option
													</Button>
												</div>
												{question.options.map((option, optionIndex) => (
													<div
														key={optionIndex}
														className="flex items-center gap-2 p-2 border rounded bg-gray-50"
													>
														<input
															type="radio"
															name={`quiz-${quizIndex}-${questionIndex}`}
															checked={option.isCorrect}
															onChange={() => {
																question.options.forEach((_, idx) => {
																	updateQuizOption(
																		quizIndex,
																		questionIndex,
																		idx,
																		"isCorrect",
																		idx === optionIndex
																	);
																});
															}}
															className="w-4 h-4"
														/>
														<Input
															placeholder={`Option ${optionIndex + 1}`}
															value={option.text}
															onChange={(e) =>
																updateQuizOption(
																	quizIndex,
																	questionIndex,
																	optionIndex,
																	"text",
																	e.target.value
																)
															}
															className="flex-1"
														/>
														{question.options.length > 2 && (
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	removeQuizOption(
																		quizIndex,
																		questionIndex,
																		optionIndex
																	)
																}
															>
																<Trash2 className="w-3 h-3" />
															</Button>
														)}
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</Modal>
	);
}
