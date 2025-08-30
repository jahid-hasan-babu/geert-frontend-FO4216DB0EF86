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
	title: string;
	lessonDescription: string;
	lessonDuration: string;
	durationSecs?: number;
	lessonVideoName?: string;
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
				title: "",
				lessonDescription: "",
				lessonDuration: "",
				durationSecs: 0,
				videoUrl: "",
			},
		],
		quizzes: [],
	});

	// Helper function to convert duration string to seconds
	const convertDurationToSeconds = (duration: string): number => {
		const match = duration.match(/(\d+)([ms]?)/);
		if (!match) return 0;

		const value = parseInt(match[1]);
		const unit = match[2] || "m"; // default to minutes

		return unit === "s" ? value : value * 60;
	};

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
						!lesson.title?.trim() ||
						!lesson.lessonDuration?.trim() ||
						!lesson.lessonType ||
						(lesson.lessonType === "video" &&
							!lesson.videoUrl &&
							!lesson.lessonVideoFile) ||
						(lesson.lessonType === "doc" &&
							!lesson.lessonDocumentFile &&
							!lesson.lessonDescription)
				)
			) {
				message.error(
					"All lesson titles, durations, types, and required files/URLs are required"
				);
				return;
			}

			if (
				moduleData.quizzes.some(
					(quiz) =>
						!quiz.title?.trim() ||
						quiz.questions.some(
							(question) =>
								!question.text?.trim() ||
								!question.type ||
								(["SINGLE_CHOICE", "MULTI_CHOICE", "ORDERING"].includes(
									question.type
								) &&
									question.options.some((option) => !option.text?.trim())) ||
								(question.type === "SCALE" &&
									(question.scaleMin === undefined ||
										question.scaleMax === undefined))
						)
				)
			) {
				message.error(
					"All quiz titles, questions, and options must be filled correctly"
				);
				return;
			}

			// Create FormData for submission
			const formData = new FormData();

			// Add module title
			formData.append("title", moduleData.moduleTitle);

			// Process lessons
			const lessonsData = moduleData.lessons.map((lesson, index) => ({
				title: lesson.title,
				type: lesson.lessonType,
				description: lesson.lessonDescription || "",
				duration: lesson.lessonDuration,
				durationSecs: convertDurationToSeconds(lesson.lessonDuration),
				position: index,
				...(lesson.lessonType === "video" &&
					lesson.videoUrl && { videoUrl: lesson.videoUrl }),
			}));

			formData.append("lessons", JSON.stringify(lessonsData));

			// Add lesson files
			moduleData.lessons.forEach((lesson, index) => {
				if (lesson.lessonVideoFile) {
					formData.append(`videoUrl`, lesson.lessonVideoFile);
				}
				if (lesson.lessonDocumentFile) {
					formData.append(`lessonDocument_${index}`, lesson.lessonDocumentFile);
				}
			});

			// Process quizzes
			if (moduleData.quizzes.length > 0) {
				const quizzesData = moduleData.quizzes.map((quiz, index) => ({
					title: quiz.title,
					position: index,
					questions: quiz.questions.map((question, qIndex) => ({
						text: question.text,
						type: question.type,
						position: qIndex,
						options: ["SINGLE_CHOICE", "MULTI_CHOICE", "ORDERING"].includes(
							question.type
						)
							? question.options.map((option, oIndex) => ({
									text: option.text,
									isCorrect: option.isCorrect,
									position: oIndex,
							  }))
							: [],
						...(question.type === "SCALE" && {
							scaleMin: question.scaleMin,
							scaleMax: question.scaleMax,
						}),
					})),
				}));

				formData.append("quizzes", JSON.stringify(quizzesData));
			}

			// Debug: Log FormData contents
			console.log("FormData contents:");
			for (const [key, value] of formData.entries()) {
				console.log(key, value instanceof File ? `File: ${value.name}` : value);
			}

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
					title: "",
					lessonDescription: "",
					lessonDuration: "",
					durationSecs: 0,
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
					title: "",
					lessonDescription: "",
					lessonDuration: "",
					durationSecs: 0,
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
										value={lesson.title}
										onChange={(e) =>
											updateLesson(index, "title", e.target.value)
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

				{/* Quizzes */}
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

										{/* Scale Options */}
										{question.type === "SCALE" && (
											<div className="grid grid-cols-2 gap-3">
												<Input
													type="number"
													placeholder="Min Scale Value"
													value={question.scaleMin || ""}
													onChange={(e) =>
														updateQuizQuestion(
															quizIndex,
															questionIndex,
															"scaleMin",
															parseInt(e.target.value) || 1
														)
													}
												/>
												<Input
													type="number"
													placeholder="Max Scale Value"
													value={question.scaleMax || ""}
													onChange={(e) =>
														updateQuizQuestion(
															quizIndex,
															questionIndex,
															"scaleMax",
															parseInt(e.target.value) || 10
														)
													}
												/>
											</div>
										)}

										{/* Question Options for choice-based questions */}
										{(question.type === "SINGLE_CHOICE" ||
											question.type === "MULTI_CHOICE") && (
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
															type={
																question.type === "SINGLE_CHOICE"
																	? "radio"
																	: "checkbox"
															}
															name={
																question.type === "SINGLE_CHOICE"
																	? `quiz-${quizIndex}-${questionIndex}`
																	: undefined
															}
															checked={option.isCorrect}
															onChange={() => {
																if (question.type === "SINGLE_CHOICE") {
																	// Single choice: only one can be correct
																	question.options.forEach((_, idx) => {
																		updateQuizOption(
																			quizIndex,
																			questionIndex,
																			idx,
																			"isCorrect",
																			idx === optionIndex
																		);
																	});
																} else {
																	// Multi choice: toggle this option
																	updateQuizOption(
																		quizIndex,
																		questionIndex,
																		optionIndex,
																		"isCorrect",
																		!option.isCorrect
																	);
																}
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

										{/* Ordering Options */}
										{question.type === "ORDERING" && (
											<div className="space-y-2">
												<div className="flex justify-between items-center">
													<label className="text-sm font-medium text-gray-700">
														Items to Order:
													</label>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															addQuizOption(quizIndex, questionIndex)
														}
													>
														<Plus className="w-3 h-3 mr-1" />
														Add Item
													</Button>
												</div>
												{question.options.map((option, optionIndex) => (
													<div
														key={optionIndex}
														className="flex items-center gap-2 p-2 border rounded bg-gray-50"
													>
														<span className="text-sm font-medium w-8">
															{optionIndex + 1}.
														</span>
														<Input
															placeholder={`Item ${optionIndex + 1}`}
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