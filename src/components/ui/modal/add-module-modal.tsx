/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
	Modal,
	Button as AntButton,
	message,
	Upload,
	Input,
	Select,
	Checkbox,
	Radio,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAddCourseModuleMutation } from "@/redux/features/courses/coursesApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import Editor from "@/components/ui/Editor/Editor";
import { usePathname } from "next/navigation";

const { Option } = Select;

// Types
interface QuizOption {
	text: string;
	isCorrect: boolean;
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
	title: string;
	type: "video" | "doc";
	description: string;
	duration: string;
	durationSecs: number;
	videoUrl?: string;
	videoFile?: File;
	documentFile?: File;
	uploadProgress?: number;
	isUploading?: boolean;
}

interface ModuleData {
	title: string;
	lesson: Lesson;
	quiz?: Quiz;
	hasQuiz: boolean;
}

interface AddModuleModalProps {
	visible: boolean;
	onCancel: () => void;
	courseId: string;
	onSuccess?: () => void;
}

// Initial values
const INITIAL_LESSON: Lesson = {
	title: "",
	type: "video",
	description: "",
	duration: "",
	durationSecs: 0,
	videoUrl: "",
};

const INITIAL_QUIZ_QUESTION: QuizQuestion = {
	text: "",
	type: "SINGLE_CHOICE",
	options: [
		{ text: "", isCorrect: true },
		{ text: "", isCorrect: false },
	],
};

const INITIAL_QUIZ: Quiz = {
	title: "",
	questions: [{ ...INITIAL_QUIZ_QUESTION }],
};

const INITIAL_MODULE_DATA: ModuleData = {
	title: "",
	lesson: { ...INITIAL_LESSON },
	hasQuiz: false,
};

export default function AddModuleModal({
	visible,
	onCancel,
	courseId,
	onSuccess,
}: AddModuleModalProps) {
	const [addCourseModule, { isLoading }] = useAddCourseModuleMutation();
	const pathname = usePathname();
	const [moduleData, setModuleData] = useState<ModuleData>(INITIAL_MODULE_DATA);

	// Convert duration string to seconds
	const convertDurationToSeconds = useCallback((duration: string): number => {
		const match = duration.match(/(\d+)([ms]?)/);
		if (!match) return 0;

		const value = parseInt(match[1]);
		const unit = match[2] || "m";

		return unit === "s" ? value : value * 60;
	}, []);

	// Update duration seconds automatically when duration changes
	const updateDuration = useCallback(
		(duration: string) => {
			const durationSecs = convertDurationToSeconds(duration);
			setModuleData((prev) => ({
				...prev,
				lesson: {
					...prev.lesson,
					duration,
					durationSecs,
				},
			}));
		},
		[convertDurationToSeconds]
	);

	// Validation
	const validateForm = useCallback((): boolean => {
		const { title, lesson, quiz, hasQuiz } = moduleData;

		if (!title.trim()) {
			message.error("Module title is required");
			return false;
		}

		if (!lesson.title.trim() || !lesson.duration.trim()) {
			message.error("Lesson title and duration are required");
			return false;
		}

		if (lesson.type === "video" && !lesson.videoUrl && !lesson.videoFile) {
			message.error("Video URL or video file is required for video lessons");
			return false;
		}

		if (lesson.type === "doc" && !lesson.documentFile && !lesson.description) {
			message.error(
				"Document file or description is required for document lessons"
			);
			return false;
		}

		if (hasQuiz && quiz) {
			if (!quiz.title.trim()) {
				message.error("Quiz title is required");
				return false;
			}

			const hasInvalidQuestion = quiz.questions.some((question) => {
				if (!question.text.trim()) return true;

				if (
					["SINGLE_CHOICE", "MULTI_CHOICE", "ORDERING"].includes(question.type)
				) {
					return question.options.some((option) => !option.text.trim());
				}

				if (question.type === "SCALE") {
					return (
						question.scaleMin === undefined || question.scaleMax === undefined
					);
				}

				return false;
			});

			if (hasInvalidQuestion) {
				message.error("All quiz questions and options must be properly filled");
				return false;
			}
		}

		return true;
	}, [moduleData]);

	// Create FormData for submission
	const createFormData = useCallback((): FormData => {
		const formData = new FormData();
		const { title, lesson, quiz, hasQuiz } = moduleData;

		// Create body data structure
		const bodyData = {
			title,
			lesson: {
				title: lesson.title,
				type: lesson.type,
				description: lesson.description || "",
				duration: lesson.duration,
				durationSecs: lesson.durationSecs,
				...(lesson.type === "video" &&
					lesson.videoUrl && { videoUrl: lesson.videoUrl }),
			},
			...(hasQuiz &&
				quiz && {
					quiz: {
						title: quiz.title,
						questions: quiz.questions.map((question) => ({
							text: question.text,
							type: question.type,
							options: ["SINGLE_CHOICE", "MULTI_CHOICE", "ORDERING"].includes(
								question.type
							)
								? question.options.map((option) => ({
										text: option.text,
										isCorrect: option.isCorrect,
								  }))
								: [],
							...(question.type === "SCALE" && {
								scaleMin: question.scaleMin,
								scaleMax: question.scaleMax,
							}),
						})),
					},
				}),
		};

		// Append JSON data
		formData.append("bodyData", JSON.stringify(bodyData));

		// Append files without index
		if (lesson.videoFile) {
			formData.append("videoUrl", lesson.videoFile);
		}

		if (lesson.documentFile) {
			formData.append("documentFile", lesson.documentFile);
		}

		return formData;
	}, [moduleData]);

	// Submit handler
	const handleSubmit = async () => {
		try {
			if (!validateForm()) return;

			const formData = createFormData();

			// Debug log
			console.log("FormData contents:");
			for (const [key, value] of formData.entries()) {
				console.log(key, value instanceof File ? `File: ${value.name}` : value);
			}

			await addCourseModule({ id: courseId, formData }).unwrap();

			message.success("Module added successfully!");
			onSuccess?.();
			handleCancel();
		} catch (error) {
			console.error("Error adding module:", error);
			message.error("Failed to add module. Please try again.");
		}
	};

	const handleCancel = useCallback(() => {
		setModuleData({
			title: "",
			lesson: { ...INITIAL_LESSON },
			hasQuiz: false,
		});
		onCancel();
	}, [onCancel]);

	// Lesson handlers
	const updateLesson = useCallback((field: keyof Lesson, value: any) => {
		setModuleData((prev) => ({
			...prev,
			lesson: { ...prev.lesson, [field]: value },
		}));
	}, []);

	const handleVideoUpload = useCallback(
		(file: File) => {
			updateLesson("videoFile", file);
			updateLesson("isUploading", true);
			updateLesson("uploadProgress", 0);

			// Simulate upload progress
			let progress = 0;
			const interval = setInterval(() => {
				progress += Math.random() * 15 + 5;
				if (progress >= 100) {
					progress = 100;
					clearInterval(interval);
					updateLesson("isUploading", false);
					updateLesson("uploadProgress", 100);
					message.success("Video uploaded successfully!");
				}
				updateLesson("uploadProgress", Math.min(progress, 100));
			}, 200 + Math.random() * 300);

			return false;
		},
		[updateLesson]
	);

	const handleDocumentUpload = useCallback(
		(file: File) => {
			updateLesson("documentFile", file);
			message.success("Document uploaded successfully!");
			return false;
		},
		[updateLesson]
	);

	// Quiz handlers
	const toggleQuiz = useCallback((checked: boolean) => {
		setModuleData((prev) => ({
			...prev,
			hasQuiz: checked,
			quiz: checked ? { ...INITIAL_QUIZ } : undefined,
		}));
	}, []);

	const updateQuiz = useCallback((field: keyof Quiz, value: any) => {
		setModuleData((prev) => ({
			...prev,
			quiz: prev.quiz ? { ...prev.quiz, [field]: value } : undefined,
		}));
	}, []);

	const addQuestion = useCallback(() => {
		if (!moduleData.quiz) return;

		const newQuestion = { ...INITIAL_QUIZ_QUESTION };
		updateQuiz("questions", [...moduleData.quiz.questions, newQuestion]);
	}, [moduleData.quiz, updateQuiz]);

	const removeQuestion = useCallback(
		(questionIndex: number) => {
			if (!moduleData.quiz || moduleData.quiz.questions.length <= 1) return;

			const filteredQuestions = moduleData.quiz.questions.filter(
				(_, i) => i !== questionIndex
			);
			updateQuiz("questions", filteredQuestions);
		},
		[moduleData.quiz, updateQuiz]
	);

	const updateQuestion = useCallback(
		(questionIndex: number, field: string, value: any) => {
			if (!moduleData.quiz) return;

			const updatedQuestions = moduleData.quiz.questions.map((question, i) =>
				i === questionIndex ? { ...question, [field]: value } : question
			);
			updateQuiz("questions", updatedQuestions);
		},
		[moduleData.quiz, updateQuiz]
	);

	const handleQuestionTypeChange = useCallback(
		(questionIndex: number, type: QuizQuestion["type"]) => {
			let newOptions: QuizOption[] = [];

			if (["SINGLE_CHOICE", "MULTI_CHOICE", "ORDERING"].includes(type)) {
				newOptions = [
					{ text: "", isCorrect: true },
					{ text: "", isCorrect: false },
				];
			}

			updateQuestion(questionIndex, "type", type);
			updateQuestion(questionIndex, "options", newOptions);

			if (type === "SCALE") {
				updateQuestion(questionIndex, "scaleMin", 1);
				updateQuestion(questionIndex, "scaleMax", 10);
			}
		},
		[updateQuestion]
	);

	const addOption = useCallback(
		(questionIndex: number) => {
			if (!moduleData.quiz) return;

			const question = moduleData.quiz.questions[questionIndex];
			const newOption = { text: "", isCorrect: false };
			const updatedOptions = [...question.options, newOption];
			updateQuestion(questionIndex, "options", updatedOptions);
		},
		[moduleData.quiz, updateQuestion]
	);

	const removeOption = useCallback(
		(questionIndex: number, optionIndex: number) => {
			if (!moduleData.quiz) return;

			const question = moduleData.quiz.questions[questionIndex];
			if (question.options.length <= 2) return;

			const updatedOptions = question.options.filter(
				(_, i) => i !== optionIndex
			);
			updateQuestion(questionIndex, "options", updatedOptions);
		},
		[moduleData.quiz, updateQuestion]
	);

	const updateOption = useCallback(
		(questionIndex: number, optionIndex: number, field: string, value: any) => {
			if (!moduleData.quiz) return;

			const question = moduleData.quiz.questions[questionIndex];
			const updatedOptions = question.options.map((option, i) =>
				i === optionIndex ? { ...option, [field]: value } : option
			);
			updateQuestion(questionIndex, "options", updatedOptions);
		},
		[moduleData.quiz, updateQuestion]
	);

	const handleOptionCorrectChange = useCallback(
		(questionIndex: number, optionIndex: number, question: QuizQuestion) => {
			if (question.type === "SINGLE_CHOICE") {
				// Single choice: only one can be correct
				const newOptions = question.options.map((opt, idx) => ({
					...opt,
					isCorrect: idx === optionIndex,
				}));
				updateQuestion(questionIndex, "options", newOptions);
			} else {
				// Multi choice: toggle this option
				updateOption(
					questionIndex,
					optionIndex,
					"isCorrect",
					!question.options[optionIndex].isCorrect
				);
			}
		},
		[updateQuestion, updateOption]
	);

	// Render lesson content based on type
	const renderLessonContent = useCallback(() => {
		const { lesson } = moduleData;

		if (lesson.type === "doc") {
			return (
				<>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Lesson Description
						</label>
						<Editor
							contents={lesson.description}
							onSave={(content) => updateLesson("description", content)}
							onBlur={() => {}}
						/>
					</div>
					<div className="flex items-center gap-3">
						<Upload
							beforeUpload={handleDocumentUpload}
							accept=".pdf,.doc,.docx,.txt"
							showUploadList={false}
						>
							<AntButton icon={<UploadOutlined />}>Upload Document</AntButton>
						</Upload>
						{lesson.documentFile && (
							<span className="text-sm text-gray-700 bg-white px-3 py-1 rounded border font-medium">
								📄 {lesson.documentFile.name}
							</span>
						)}
					</div>
				</>
			);
		}

		return (
			<div className="space-y-3">
				<Input
					placeholder="Video URL"
					value={lesson.videoUrl}
					onChange={(e) => updateLesson("videoUrl", e.target.value)}
				/>
				<div className="flex items-center gap-3">
					<Upload
						beforeUpload={handleVideoUpload}
						accept="video/*"
						showUploadList={false}
						disabled={lesson.isUploading}
					>
						<AntButton icon={<UploadOutlined />} disabled={lesson.isUploading}>
							{lesson.isUploading ? "Uploading..." : "Upload Video"}
						</AntButton>
					</Upload>
					{lesson.videoFile && (
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-700 bg-white px-3 py-1 rounded border font-medium">
								📹 {lesson.videoFile.name}
							</span>
							{lesson.isUploading && (
								<span className="text-xs text-blue-600 font-medium">
									{Math.round(lesson.uploadProgress || 0)}%
								</span>
							)}
						</div>
					)}
				</div>
				{lesson.isUploading && lesson.uploadProgress !== undefined && (
					<div className="space-y-1">
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
								style={{ width: `${lesson.uploadProgress}%` }}
							/>
						</div>
						<p className="text-xs text-gray-600">
							Uploading video... {Math.round(lesson.uploadProgress)}% complete
						</p>
					</div>
				)}
			</div>
		);
	}, [
		moduleData.lesson,
		updateLesson,
		handleDocumentUpload,
		handleVideoUpload,
	]);

	// Render quiz options based on question type
	const renderQuizOptions = useCallback(
		(question: QuizQuestion, questionIndex: number) => {
			if (question.type === "SCALE") {
				return (
					<div className="grid grid-cols-2 gap-3">
						<Input
							type="number"
							placeholder="Min Scale Value"
							value={question.scaleMin || ""}
							onChange={(e) =>
								updateQuestion(
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
								updateQuestion(
									questionIndex,
									"scaleMax",
									parseInt(e.target.value) || 10
								)
							}
						/>
					</div>
				);
			}

			if (question.type === "TEXT") {
				return (
					<div className="p-3 bg-gray-50 rounded border">
						<p className="text-sm text-gray-600">
							This is a text answer question. Students will provide written
							responses.
						</p>
					</div>
				);
			}

			const isOrderingType = question.type === "ORDERING";

			return (
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<label className="text-sm font-medium text-gray-700">
							{isOrderingType ? "Items to Order:" : "Answer Options:"}
						</label>
						<Button
							variant="outline"
							size="sm"
							onClick={() => addOption(questionIndex)}
						>
							<Plus className="w-3 h-3 mr-1" />
							Add {isOrderingType ? "Item" : "Option"}
						</Button>
					</div>
					{question.options.map((option, optionIndex) => (
						<div
							key={optionIndex}
							className="flex items-center gap-2 p-2 border rounded bg-gray-50"
						>
							{isOrderingType ? (
								<span className="text-sm font-medium w-8">
									{optionIndex + 1}.
								</span>
							) : question.type === "SINGLE_CHOICE" ? (
								<Radio
									checked={option.isCorrect}
									onChange={() =>
										handleOptionCorrectChange(
											questionIndex,
											optionIndex,
											question
										)
									}
								/>
							) : (
								<Checkbox
									checked={option.isCorrect}
									onChange={() =>
										handleOptionCorrectChange(
											questionIndex,
											optionIndex,
											question
										)
									}
								/>
							)}
							<Input
								placeholder={`${isOrderingType ? "Item" : "Option"} ${
									optionIndex + 1
								}`}
								value={option.text}
								onChange={(e) =>
									updateOption(
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
									onClick={() => removeOption(questionIndex, optionIndex)}
								>
									<Trash2 className="w-3 h-3" />
								</Button>
							)}
						</div>
					))}
				</div>
			);
		},
		[addOption, updateOption, removeOption, handleOptionCorrectChange]
	);

	const isMicroLearningPath =
		pathname === "/dashboard/micro-learning/add-microLearning";

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
						value={moduleData.title}
						onChange={(e) =>
							setModuleData((prev) => ({ ...prev, title: e.target.value }))
						}
					/>
				</div>

				{/* Lesson Section */}
				<div className="space-y-4">
					<h4 className="font-medium text-gray-700">Lesson</h4>
					<Card className="border border-gray-200">
						<CardContent className="p-4 space-y-3">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
								<Input
									placeholder="Lesson Title *"
									value={moduleData.lesson.title}
									onChange={(e) => updateLesson("title", e.target.value)}
								/>
								<Input
									placeholder="Duration (e.g., 5m, 30s) *"
									value={moduleData.lesson.duration}
									onChange={(e) => updateDuration(e.target.value)}
								/>
								<Select
									value={moduleData.lesson.type}
									onChange={(value) => updateLesson("type", value)}
									placeholder="Lesson Type *"
								>
									<Option value="video">Video</Option>
									<Option value="doc">Document</Option>
								</Select>
							</div>

							{renderLessonContent()}
						</CardContent>
					</Card>
				</div>

				{/* Quiz Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Checkbox
							checked={moduleData.hasQuiz}
							onChange={(e) => toggleQuiz(e.target.checked)}
						>
							<span className="font-medium text-gray-700">
								Add Quiz (Optional)
							</span>
						</Checkbox>
					</div>

					{moduleData.hasQuiz && moduleData.quiz && (
						<Card className="border border-blue-200 bg-blue-50">
							<CardContent className="p-4 space-y-4">
								<Input
									placeholder="Quiz Title *"
									value={moduleData.quiz.title}
									onChange={(e) => updateQuiz("title", e.target.value)}
								/>

								<div className="flex justify-between items-center">
									<h5 className="font-medium text-gray-700">Questions</h5>
									<Button variant="outline" size="sm" onClick={addQuestion}>
										<Plus className="w-3 h-3 mr-1" />
										Add Question
									</Button>
								</div>

								{moduleData.quiz.questions.map((question, questionIndex) => (
									<div
										key={questionIndex}
										className="space-y-3 p-4 bg-white rounded border"
									>
										<div className="flex items-center gap-3">
											<Input
												placeholder="Question Text *"
												value={question.text}
												onChange={(e) =>
													updateQuestion(questionIndex, "text", e.target.value)
												}
												className="flex-1"
											/>
											<Select
												value={question.type}
												onChange={(value) =>
													handleQuestionTypeChange(questionIndex, value)
												}
												className="w-48"
											>
												<Option value="SINGLE_CHOICE">Single Choice</Option>
												{isMicroLearningPath && (
													<>
														<Option value="MULTI_CHOICE">Multi Choice</Option>
														<Option value="ORDERING">Ordering</Option>
														<Option value="SCALE">Scale</Option>
														<Option value="TEXT">Text Answer</Option>
													</>
												)}
											</Select>
											{moduleData.quiz &&
												moduleData.quiz.questions.length > 1 && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => removeQuestion(questionIndex)}
													>
														<Trash2 className="w-3 h-3" />
													</Button>
												)}
										</div>

										{renderQuizOptions(question, questionIndex)}
									</div>
								))}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</Modal>
	);
}