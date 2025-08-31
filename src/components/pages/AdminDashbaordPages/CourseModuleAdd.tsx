/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Video, FileText } from "lucide-react";
import Editor from "../../ui/Editor/Editor";
import { usePathname } from "next/navigation";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

type Lesson = {
	lessonType: "video" | "doc";
	lessonTitle: string;
	lessonDescription: string;
	lessonDuration: string;
	lessonVideoName: string;
	lessonDocumentFile?: File;
	lessonVideoFile?: File;
	uploadProgress?: number;
	isUploading?: boolean;
};

type QuizOption = {
	text: string;
	isCorrect: boolean;
	value?: string;
	files?: File[];
	fileNames?: string[];
	keywords?: string[];
};

type QuizQuestion = {
	text: string;
	type: "SINGLE_CHOICE" | "MULTI_CHOICE" | "ORDERING" | "SCALE" | "TEXT";
	options: QuizOption[];
	scaleMin?: number;
	scaleMax?: number;
};

type Quiz = {
	title: string;
	questions: QuizQuestion[];
};

type Module = {
	moduleTitle: string;
	lessons: Lesson[];
	quizzes: Quiz[];
};

interface CourseModuleAddProps {
	modules: Module[];
	setModules: React.Dispatch<React.SetStateAction<Module[]>>;
	isMicroLearning: boolean;
}

export default function CourseModuleAdd({
	modules,
	setModules,
	isMicroLearning,
}: CourseModuleAddProps) {
	const pathname = usePathname();

	const addNewModule = () => {
		setModules((prev) => [
			...prev,
			{
				moduleTitle: "",
				lessons: [
					{
						lessonType: "video",
						lessonTitle: "",
						lessonDescription: "",
						lessonDuration: "",
						lessonVideoName: "",
					},
				],
				quizzes: [],
			},
		]);
	};

	const removeModule = (moduleIndex: number) => {
		if (modules.length > 1) {
			setModules((prev) => prev.filter((_, idx) => idx !== moduleIndex));
		}
	};

	const addNewLesson = (moduleIndex: number) => {
		setModules((prev) =>
			prev.map((module, idx) =>
				idx === moduleIndex
					? {
							...module,
							lessons: [
								...module.lessons,
								{
									lessonType: "video",
									lessonTitle: "",
									lessonDescription: "",
									lessonDuration: "",
									lessonVideoName: "",
								},
							],
					  }
					: module
			)
		);
	};

	const removeLesson = (moduleIndex: number, lessonIndex: number) => {
		setModules((prev) =>
			prev.map((module, idx) =>
				idx === moduleIndex
					? {
							...module,
							lessons: module.lessons.filter((_, lIdx) => lIdx !== lessonIndex),
					  }
					: module
			)
		);
	};

	const addNewQuiz = (moduleIndex: number) => {
		setModules((prev) =>
			prev.map((module, idx) =>
				idx === moduleIndex
					? {
							...module,
							quizzes: [
								...module.quizzes,
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
					  }
					: module
			)
		);
	};

	const removeQuiz = (moduleIndex: number, quizIndex: number) => {
		setModules((prev) =>
			prev.map((module, idx) =>
				idx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.filter((_, qIdx) => qIdx !== quizIndex),
					  }
					: module
			)
		);
	};

	const updateModule = (moduleIndex: number, field: string, value: string) => {
		setModules((prev) =>
			prev.map((module, idx) =>
				idx === moduleIndex ? { ...module, [field]: value } : module
			)
		);
	};

	const updateLesson = (
		moduleIndex: number,
		lessonIndex: number,
		field: string,
		value: string | File | boolean | number
	) => {
		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							lessons: module.lessons.map((lesson, lIdx) =>
								lIdx === lessonIndex ? { ...lesson, [field]: value } : lesson
							),
					  }
					: module
			)
		);
	};

	const updateQuiz = (
		moduleIndex: number,
		quizIndex: number,
		field: string,
		value: string
	) => {
		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.map((quiz, qIdx) =>
								qIdx === quizIndex ? { ...quiz, [field]: value } : quiz
							),
					  }
					: module
			)
		);
	};

	const updateQuizQuestion = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number,
		field: string,
		value: string | QuizOption[] | number
	) => {
		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.map((quiz, qIdx) =>
								qIdx === quizIndex
									? {
											...quiz,
											questions: quiz.questions.map((question, questionIdx) =>
												questionIdx === questionIndex
													? { ...question, [field]: value }
													: question
											),
									  }
									: quiz
							),
					  }
					: module
			)
		);
	};

	const updateQuizOption = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number,
		optionIndex: number,
		field: string,
		value: string | boolean | File[] | string[]
	) => {
		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.map((quiz, qIdx) =>
								qIdx === quizIndex
									? {
											...quiz,
											questions: quiz.questions.map((question, questionIdx) =>
												questionIdx === questionIndex
													? {
															...question,
															options: question.options.map((option, optIdx) =>
																optIdx === optionIndex
																	? { ...option, [field]: value }
																	: option
															),
													  }
													: question
											),
									  }
									: quiz
							),
					  }
					: module
			)
		);
	};

	const handleVideoUpload = (moduleIndex: number, lessonIndex: number) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "video/*";
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				updateLesson(moduleIndex, lessonIndex, "lessonVideoFile", file);
				updateLesson(moduleIndex, lessonIndex, "lessonVideoName", file.name);
				updateLesson(moduleIndex, lessonIndex, "isUploading", true);
				updateLesson(moduleIndex, lessonIndex, "uploadProgress", 0);

				let progress = 0;
				const interval = setInterval(() => {
					progress += Math.random() * 15 + 5;
					if (progress >= 100) {
						progress = 100;
						clearInterval(interval);
						updateLesson(moduleIndex, lessonIndex, "isUploading", false);
						updateLesson(moduleIndex, lessonIndex, "uploadProgress", 100);
						console.log("[v0] Video upload completed:", file.name);
					}
					updateLesson(
						moduleIndex,
						lessonIndex,
						"uploadProgress",
						Math.min(progress, 100)
					);
				}, 200 + Math.random() * 300);
			}
		};
		input.click();
	};

	const handleDocumentUpload = (moduleIndex: number, lessonIndex: number) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".pdf,.doc,.docx,.txt";
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				updateLesson(moduleIndex, lessonIndex, "lessonDocumentFile", file);
				updateLesson(moduleIndex, lessonIndex, "lessonVideoName", file.name);
			}
		};
		input.click();
	};

	const handleQuizOptionFileUpload = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number,
		optionIndex: number
	) => {
		const input = document.createElement("input");
		input.type = "file";
		input.multiple = true;
		input.accept = "image/*,video/*,.pdf,.doc,.docx,.txt";
		input.onchange = (e) => {
			const files = Array.from((e.target as HTMLInputElement).files || []);
			if (files.length > 0) {
				const fileNames = files.map((file) => file.name);
				updateQuizOption(
					moduleIndex,
					quizIndex,
					questionIndex,
					optionIndex,
					"files",
					files
				);
				updateQuizOption(
					moduleIndex,
					quizIndex,
					questionIndex,
					optionIndex,
					"fileNames",
					fileNames
				);
			}
		};
		input.click();
	};

	const addQuizOption = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number
	) => {
		const question =
			modules[moduleIndex].quizzes[quizIndex].questions[questionIndex];
		let newOption: QuizOption;

		if (question.type === "SCALE") {
			// For scale, default to 'good' enum value
			newOption = { text: "", value: "good", isCorrect: true };
		} else if (question.type === "TEXT") {
			newOption = { text: "", isCorrect: true, keywords: [] };
		} else {
			newOption = { text: "", isCorrect: false };
		}

		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.map((quiz, qIdx) =>
								qIdx === quizIndex
									? {
											...quiz,
											questions: quiz.questions.map((question, questionIdx) =>
												questionIdx === questionIndex
													? {
															...question,
															options: [...question.options, newOption],
													  }
													: question
											),
									  }
									: quiz
							),
					  }
					: module
			)
		);
	};

	const removeQuizOption = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number,
		optionIndex: number
	) => {
		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.map((quiz, qIdx) =>
								qIdx === quizIndex
									? {
											...quiz,
											questions: quiz.questions.map((question, questionIdx) =>
												questionIdx === questionIndex
													? {
															...question,
															options: question.options.filter(
																(_, optIdx) => optIdx !== optionIndex
															),
													  }
													: question
											),
									  }
									: quiz
							),
					  }
					: module
			)
		);
	};

	const addQuizQuestion = (moduleIndex: number, quizIndex: number) => {
		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.map((quiz, qIdx) =>
								qIdx === quizIndex
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
					  }
					: module
			)
		);
	};

	const removeQuizQuestion = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number
	) => {
		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.map((quiz, qIdx) =>
								qIdx === quizIndex
									? {
											...quiz,
											questions: quiz.questions.filter(
												(_, questionIdx) => questionIdx !== questionIndex
											),
									  }
									: quiz
							),
					  }
					: module
			)
		);
	};

	const handleQuestionTypeChange = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number,
		newType: "SINGLE_CHOICE" | "MULTI_CHOICE" | "ORDERING" | "SCALE" | "TEXT"
	) => {
		setModules((prev) =>
			prev.map((module, mIdx) =>
				mIdx === moduleIndex
					? {
							...module,
							quizzes: module.quizzes.map((quiz, qIdx) =>
								qIdx === quizIndex
									? {
											...quiz,
											questions: quiz.questions.map((question, questionIdx) => {
												if (questionIdx === questionIndex) {
													let newOptions: QuizOption[] = [];

													if (
														newType === "SINGLE_CHOICE" ||
														newType === "MULTI_CHOICE"
													) {
														newOptions = [
															{ text: "", isCorrect: true },
															{ text: "", isCorrect: false },
														];
													} else if (newType === "ORDERING") {
														newOptions = [
															{ text: "", isCorrect: true },
															{ text: "", isCorrect: true },
															{ text: "", isCorrect: true },
														];
													} else if (newType === "SCALE") {
														newOptions = [
															{ text: "", value: "bad", isCorrect: true },
															{ text: "", value: "neutral", isCorrect: true },
															{ text: "", value: "good", isCorrect: true },
														];
													} else if (newType === "TEXT") {
														newOptions = [
															{ text: "", isCorrect: true, keywords: [] },
														];
													}

													return {
														...question,
														type: newType,
														options: newOptions,
														scaleMin: newType === "SCALE" ? 1 : undefined,
														scaleMax: newType === "SCALE" ? 5 : undefined,
													};
												}
												return question;
											}),
									  }
									: quiz
							),
					  }
					: module
			)
		);
	};

	const handleLessonDescriptionChange = (
		moduleIndex: number,
		lessonIndex: number,
		content: string
	) => {
		updateLesson(moduleIndex, lessonIndex, "lessonDescription", content);
	};

	const addKeywordToTextOption = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number,
		optionIndex: number,
		keyword: string
	) => {
		const currentOption =
			modules[moduleIndex].quizzes[quizIndex].questions[questionIndex].options[
				optionIndex
			];
		const currentKeywords = currentOption.keywords || [];

		if (keyword.trim() && !currentKeywords.includes(keyword.trim())) {
			updateQuizOption(
				moduleIndex,
				quizIndex,
				questionIndex,
				optionIndex,
				"keywords",
				[...currentKeywords, keyword.trim()]
			);
		}
	};

	const removeKeywordFromTextOption = (
		moduleIndex: number,
		quizIndex: number,
		questionIndex: number,
		optionIndex: number,
		keywordIndex: number
	) => {
		const currentOption =
			modules[moduleIndex].quizzes[quizIndex].questions[questionIndex].options[
				optionIndex
			];
		const currentKeywords = currentOption.keywords || [];

		updateQuizOption(
			moduleIndex,
			quizIndex,
			questionIndex,
			optionIndex,
			"keywords",
			currentKeywords.filter((_, idx) => idx !== keywordIndex)
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-semibold text-gray-900">Course Modules</h2>
				<Button onClick={addNewModule} variant="outline">
					<Plus className="w-4 h-4 mr-2" />
					Add Module
				</Button>
			</div>

			{modules.map((module, moduleIndex) => (
				<Card key={moduleIndex} className="border-2 border-gray-100">
					<CardContent className="p-6">
						<div className="space-y-4">
							{/* Module Header */}
							<div className="flex items-center gap-3">
								<Input
									placeholder="Module Title *"
									value={module.moduleTitle}
									onChange={(e) =>
										updateModule(moduleIndex, "moduleTitle", e.target.value)
									}
									className="flex-1"
									required
								/>
								{modules.length > 1 && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => removeModule(moduleIndex)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								)}
							</div>

							{/* Lessons */}
							<div className="space-y-3">
								<h4 className="font-medium text-gray-700">Lessons</h4>
								{module.lessons.map((lesson, lessonIndex) => (
									<div
										key={lessonIndex}
										className="border rounded-lg p-4 space-y-3 bg-gray-50"
									>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
											<Input
												placeholder="Lesson Title *"
												value={lesson.lessonTitle}
												onChange={(e) =>
													updateLesson(
														moduleIndex,
														lessonIndex,
														"lessonTitle",
														e.target.value
													)
												}
												required
											/>
											{
												lesson.lessonType === "video" && (
												<TimePicker
												value={lesson.lessonDuration ? dayjs(lesson.lessonDuration, "HH:mm:ss") : null}
												format="HH:mm:ss"
												onChange={(time) => {
													const formatted = time ? time.format("HH:mm:ss") : "00:00:00";

													// Update your lesson state
													updateLesson(moduleIndex, lessonIndex, "lessonDuration", formatted);
												}}
												placeholder="Select duration"
												secondStep={1} // enable seconds
												minuteStep={1}
												hourStep={1}
												use12Hours={false}
												/>
												)
											}
											
											<Select
												value={lesson.lessonType}
												onValueChange={(value: "video" | "doc") =>
													updateLesson(
														moduleIndex,
														lessonIndex,
														"lessonType",
														value
													)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Lesson Type *" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="video">Video</SelectItem>
													<SelectItem value="doc">Document</SelectItem>
												</SelectContent>
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
														handleLessonDescriptionChange(
															moduleIndex,
															lessonIndex,
															content
														)
													}
													onBlur={() => {}}
												/>
											</div>
										)}

										{/* Video Upload */}
										{lesson.lessonType === "video" && (
											<div className="space-y-3">
												<div className="flex items-center gap-3">
													<Button
														type="button"
														variant="outline"
														onClick={() =>
															handleVideoUpload(moduleIndex, lessonIndex)
														}
														disabled={lesson.isUploading}
													>
														<Video className="w-4 h-4 mr-2" />
														{lesson.isUploading
															? "Uploading..."
															: "Upload Video"}
													</Button>
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

												{lesson.uploadProgress === 100 &&
													!lesson.isUploading && (
														<div className="flex items-center gap-2 text-green-600 text-sm">
															<div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
																✓
															</div>
															Video uploaded successfully
														</div>
													)}
											</div>
										)}

										{/* Remove Lesson */}
										<div className="flex justify-end">
											{module.lessons.length > 1 && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => removeLesson(moduleIndex, lessonIndex)}
												>
													<Trash2 className="w-4 h-4 mr-2" />
													Remove Lesson
												</Button>
											)}
										</div>
									</div>
								))}

								<Button
									onClick={() => addNewLesson(moduleIndex)}
									variant="outline"
									size="sm"
								>
									<Plus className="w-4 h-4 mr-2" />
									Add Lesson
								</Button>
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<h4 className="font-medium text-gray-700">Quizzes</h4>
									<Button
										onClick={() => addNewQuiz(moduleIndex)}
										variant="outline"
										size="sm"
									>
										<Plus className="w-4 h-4 mr-2" />
										Add Quiz
									</Button>
								</div>

								{module.quizzes.map((quiz, quizIndex) => (
									<div
										key={quizIndex}
										className="border rounded-lg p-4 space-y-3 bg-blue-50"
									>
										<div className="flex items-center gap-3">
											<Input
												placeholder="Quiz Title *"
												value={quiz.title}
												onChange={(e) =>
													updateQuiz(
														moduleIndex,
														quizIndex,
														"title",
														e.target.value
													)
												}
												className="flex-1"
												required
											/>
											<Button
												variant="outline"
												size="sm"
												onClick={() => removeQuiz(moduleIndex, quizIndex)}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>

										{/* Add Question Button */}
										<div className="flex justify-end">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => addQuizQuestion(moduleIndex, quizIndex)}
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
																moduleIndex,
																quizIndex,
																questionIndex,
																"text",
																e.target.value
															)
														}
														className="flex-1"
														required
													/>
													{/* Question Type Selector */}
													<Select
														value={question.type}
														onValueChange={(
															value:
																| "SINGLE_CHOICE"
																| "MULTI_CHOICE"
																| "ORDERING"
																| "SCALE"
																| "TEXT"
														) =>
															handleQuestionTypeChange(
																moduleIndex,
																quizIndex,
																questionIndex,
																value
															)
														}
													>
														<SelectTrigger className="w-48">
															<SelectValue placeholder="Question Type" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="SINGLE_CHOICE">
																Single Choice
															</SelectItem>
															{pathname ===
																"/dashboard/micro-learning/add-microLearning" && (
																<>
																	<SelectItem value="MULTI_CHOICE">
																		Multi Choice
																	</SelectItem>
																	<SelectItem value="ORDERING">
																		Ordering
																	</SelectItem>
																	<SelectItem value="SCALE">Scale</SelectItem>
																	<SelectItem value="TEXT">
																		Text Answer
																	</SelectItem>
																</>
															)}
														</SelectContent>
													</Select>
													{/* Remove Question Button */}
													{quiz.questions.length > 1 && (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() =>
																removeQuizQuestion(
																	moduleIndex,
																	quizIndex,
																	questionIndex
																)
															}
														>
															<Trash2 className="w-3 h-3" />
														</Button>
													)}
												</div>

												{/* Conditional Rendering for Different Question Types */}
												{question.type === "SINGLE_CHOICE" && (
													<div className="space-y-2">
														<div className="flex justify-between items-center">
															<label className="text-sm font-medium text-gray-700">
																Answer Options:
															</label>
															<Button
																type="button"
																variant="outline"
																size="sm"
																onClick={() =>
																	addQuizOption(
																		moduleIndex,
																		quizIndex,
																		questionIndex
																	)
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
																	name={`quiz-${moduleIndex}-${quizIndex}-${questionIndex}`}
																	checked={option.isCorrect}
																	onChange={() => {
																		question.options.forEach((_, idx) => {
																			updateQuizOption(
																				moduleIndex,
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
																			moduleIndex,
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
																		type="button"
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			removeQuizOption(
																				moduleIndex,
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

												{question.type === "MULTI_CHOICE" && (
													<div className="space-y-2">
														<div className="flex justify-between items-center">
															<label className="text-sm font-medium text-gray-700">
																Answer Options (Multiple can be correct):
															</label>
															<Button
																type="button"
																variant="outline"
																size="sm"
																onClick={() =>
																	addQuizOption(
																		moduleIndex,
																		quizIndex,
																		questionIndex
																	)
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
																	type="checkbox"
																	checked={option.isCorrect}
																	onChange={(e) =>
																		updateQuizOption(
																			moduleIndex,
																			quizIndex,
																			questionIndex,
																			optionIndex,
																			"isCorrect",
																			e.target.checked
																		)
																	}
																	className="w-4 h-4"
																/>
																<Input
																	placeholder={`Option ${optionIndex + 1}`}
																	value={option.text}
																	onChange={(e) =>
																		updateQuizOption(
																			moduleIndex,
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
																		type="button"
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			removeQuizOption(
																				moduleIndex,
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

												{question.type === "ORDERING" && (
													<div className="space-y-2">
														<div className="flex justify-between items-center">
															<label className="text-sm font-medium text-gray-700">
																Items to Order:
															</label>
															<Button
																type="button"
																variant="outline"
																size="sm"
																onClick={() =>
																	addQuizOption(
																		moduleIndex,
																		quizIndex,
																		questionIndex
																	)
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
																<span className="text-sm font-medium text-gray-600 w-8">
																	#{optionIndex + 1}
																</span>
																<Input
																	placeholder={`Item ${optionIndex + 1}`}
																	value={option.text}
																	onChange={(e) =>
																		updateQuizOption(
																			moduleIndex,
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
																		type="button"
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			removeQuizOption(
																				moduleIndex,
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

												{question.type === "SCALE" && (
													<div className="space-y-3">
														{/* Scale Labels */}
														<div className="space-y-2">
															<div className="flex justify-between items-center">
																<label className="text-sm font-medium text-gray-700">
																	Scale Labels:
																</label>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		addQuizOption(
																			moduleIndex,
																			quizIndex,
																			questionIndex
																		)
																	}
																>
																	<Plus className="w-3 h-3 mr-1" />
																	Add Label
																</Button>
															</div>

															<div className="space-y-3 p-3 border rounded bg-gray-50">
																{question.options.map((option, optionIndex) => (
																	<div
																		key={optionIndex}
																		className="flex items-center gap-3"
																	>
																		{/* Scale Value Selector */}
																		<div className="w-24">
																			<Select
																				value={option.value || "good"}
																				onValueChange={(value) => {
																					updateQuizOption(
																						moduleIndex,
																						quizIndex,
																						questionIndex,
																						optionIndex,
																						"value",
																						value
																					);
																				}}
																			>
																				<SelectTrigger className="text-xs">
																					<SelectValue placeholder="Value" />
																				</SelectTrigger>
																				<SelectContent>
																					<SelectItem value="bad">
																						Bad
																					</SelectItem>
																					<SelectItem value="neutral">
																						Neutral
																					</SelectItem>
																					<SelectItem value="good">
																						Good
																					</SelectItem>
																				</SelectContent>
																			</Select>
																		</div>

																		<span className="text-sm font-medium">
																			:
																		</span>

																		{/* Label Text Input */}
																		<Input
																			type="text"
																			placeholder={
																				option.value === "bad"
																					? "e.g., Poor, Strongly Disagree, Never"
																					: option.value === "good"
																					? "e.g., Excellent, Strongly Agree, Always"
																					: option.value === "neutral"
																					? "e.g., Fair, Neutral, Sometimes"
																					: "Enter label text"
																			}
																			value={option.text}
																			onChange={(e) =>
																				updateQuizOption(
																					moduleIndex,
																					quizIndex,
																					questionIndex,
																					optionIndex,
																					"text",
																					e.target.value
																				)
																			}
																			className="flex-1"
																		/>

																		{/* Remove Label Button */}
																		{question.options.length > 1 && (
																			<Button
																				type="button"
																				variant="outline"
																				size="sm"
																				onClick={() =>
																					removeQuizOption(
																						moduleIndex,
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

															<p className="text-xs text-gray-500">
																Select enum values (bad, neutral, good) and add
																corresponding labels. Multiple labels can have
																the same enum value.
															</p>
														</div>
													</div>
												)}

												{question.type === "TEXT" && (
													<div className="space-y-3">
														<div className="p-3 border rounded bg-gray-50">
															<p className="text-sm text-gray-600 mb-3">
																📝 Students will provide a text answer for this
																question.
															</p>

															{/* Expected Answer Input */}
															<div className="space-y-3">
																<div>
																	<label className="text-sm font-medium text-gray-700 mb-2 block">
																		Expected Answer (Optional):
																	</label>
																	<Input
																		placeholder="Enter the expected answer or sample response"
																		value={question.options[0]?.text || ""}
																		onChange={(e) =>
																			updateQuizOption(
																				moduleIndex,
																				quizIndex,
																				questionIndex,
																				0,
																				"text",
																				e.target.value
																			)
																		}
																		className="w-full"
																	/>
																	<p className="text-xs text-gray-500 mt-1">
																		This will be used as a reference for grading
																		text responses.
																	</p>
																</div>
															</div>

															{/* Keywords Configuration */}
															<div className="space-y-2">
																<label className="text-sm font-medium text-gray-700">
																	Expected Keywords (Optional):
																</label>

																{question.options[0]?.keywords &&
																	question.options[0].keywords.length > 0 && (
																		<div className="flex flex-wrap gap-2 mb-2">
																			{question.options[0].keywords.map(
																				(keyword, keywordIndex) => (
																					<span
																						key={keywordIndex}
																						className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
																					>
																						{keyword}
																						<button
																							type="button"
																							onClick={() =>
																								removeKeywordFromTextOption(
																									moduleIndex,
																									quizIndex,
																									questionIndex,
																									0,
																									keywordIndex
																								)
																							}
																							className="text-blue-600 hover:text-blue-800"
																						>
																							×
																						</button>
																					</span>
																				)
																			)}
																		</div>
																	)}

																<div className="flex gap-2">
																	<Input
																		placeholder="Add keyword (press Enter)"
																		onKeyPress={(e) => {
																			if (e.key === "Enter") {
																				e.preventDefault();
																				const keyword = e.currentTarget.value;
																				if (keyword.trim()) {
																					addKeywordToTextOption(
																						moduleIndex,
																						quizIndex,
																						questionIndex,
																						0,
																						keyword
																					);
																					e.currentTarget.value = "";
																				}
																			}
																		}}
																		className="flex-1"
																	/>
																	<Button
																		type="button"
																		variant="outline"
																		size="sm"
																		onClick={(e) => {
																			const input =
																				e.currentTarget.parentElement?.querySelector(
																					"input"
																				) as HTMLInputElement;
																			if (input?.value.trim()) {
																				addKeywordToTextOption(
																					moduleIndex,
																					quizIndex,
																					questionIndex,
																					0,
																					input.value
																				);
																				input.value = "";
																			}
																		}}
																	>
																		<Plus className="w-3 h-3" />
																	</Button>
																</div>

																<p className="text-xs text-gray-500">
																	Add keywords that should be present in correct
																	answers. Students responses will be evaluated
																	based on these keywords.
																</p>
															</div>
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
