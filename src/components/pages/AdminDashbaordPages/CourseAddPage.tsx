/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-assign-module-variable */
"use client";

import type React from "react";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
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
import { Upload, AlertCircle, TimerIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAddMicroLearningMutation } from "@/redux/features/courses/coursesApi";
import { z } from "zod";
import {
  useGetCoursesCategoryQuery,
  useGetUserQuery,
} from "@/redux/features/users&category/usersCategoryApi";
import { toast } from "sonner";
import Editor from "../../ui/Editor/Editor";
import CourseModuleAdd from "./CourseModuleAdd";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

type QuizOption = {
  text: string;
  isCorrect: boolean;
  files?: File[];
  fileNames?: string[];
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

type Lesson = {
  lessonType: "video" | "doc";
  lessonTitle: string;
  lessonDescription: string;
  lessonDuration: string;
  lessonVideoName: string;
  lessonVideoFile?: File;
  lessonDocumentFile?: File;
};

type Module = {
  moduleTitle: string;
  lessons: Lesson[];
  quizzes: Quiz[];
};

type Category = {
  id: string;
  name: string;
};

type Instructor = {
  id: string;
  username: string;
};

export default function CourseAddPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isMicroLearning =
    pathname === "/dashboard/micro-learning/add-microLearning";

  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCoursesCategoryQuery({});
  const { data: instructorsResponse, isLoading: isInstructorsLoading } =
    useGetUserQuery({ filter: "INSTRUCTOR" });
  const [addMicroLearning, { isLoading: isSubmitting }] =
    useAddMicroLearningMutation();

  const categories = categoriesResponse?.data?.data || [];
  const instructors = instructorsResponse?.data?.data || [];

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    categoryId: "",
    duration: "0",
    price: null, // <-- null instead of 0
    instructorId: "",
    instructorEmail: "",
  });

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageName, setCoverImageName] = useState("");
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [modules, setModules] = useState<Module[]>([
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

  const handleCoverClick = () => coverInputRef.current?.click();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImageName(file.name);
    }
  };

  const handleInputChange = (field: string, value: string | number | null) => {
      setCourseData((prev) => ({ ...prev, [field]: value }));
      // Clear validation errors when user starts typing
      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
    };

  const handleDescriptionChange = (content: string) => {
    setCourseData((prev) => ({ ...prev, description: content }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = (): boolean => {
    try {
      const courseValidationSchema = z.object({
        title: z.string().min(1, "Course title is required"),
        description: z
          .string()
          .min(10, "Description must be at least 10 characters"),
        categoryId: z.string().min(1, "Category is required"),
        duration: z.string().min(1, "Duration is required"),
        instructorId: z.string().min(1, "Instructor is required"),
        instructorEmail: z.string().email("Valid email is required"),
      });

      courseValidationSchema.parse(courseData);

      // Additional validation for modules
      if (modules.length === 0) {
        setValidationErrors(["At least one module is required"]);
        return false;
      }

      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        if (!module.moduleTitle.trim()) {
          setValidationErrors([`Module ${i + 1} title is required`]);
          return false;
        }

        if (module.lessons.length === 0) {
          setValidationErrors([
            `Module ${i + 1} must have at least one lesson`,
          ]);
          return false;
        }

        for (let j = 0; j < module.lessons.length; j++) {
          const lesson = module.lessons[j];
          if (!lesson.lessonTitle.trim()) {
            setValidationErrors([
              `Module ${i + 1}, Lesson ${j + 1} title is required`,
            ]);
            return false;
          }
          if (lesson.lessonType === "video" && !lesson.lessonDuration.trim()) {
            setValidationErrors([
              `Module ${i + 1}, Lesson ${j + 1} duration is required`,
            ]);
            return false;
          }
        }
      }

      setValidationErrors([]);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => err.message);
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast("Please fix the form errors before submitting.");
      return;
    }

    try {
      const formData = new FormData();

      // Convert duration to seconds helper function
      const convertDurationToSeconds = (duration: string): number => {
        const parts = duration.split(":").map((p) => parseInt(p, 10) || 0);
        let seconds = 0;

        if (parts.length === 3) {
          // HH:MM:SS
          seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          // MM:SS
          seconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
          // Only seconds
          seconds = parts[0];
        }

        return seconds;
      };

      const bodyData = {
        title: courseData.title,
        description: courseData.description,
        categoryId: courseData.categoryId,
        duration: courseData.duration,
        price: courseData.price,
        isMicroLearning: isMicroLearning,
        instructorId: courseData.instructorId,
        modules: modules.map((mod) => ({
          title: mod.moduleTitle,
          lessons: mod.lessons.map((lesson) => ({
            type: lesson.lessonType,
            title: lesson.lessonTitle,
            description: lesson.lessonDescription || lesson.lessonTitle,
            duration:
              lesson.lessonType === "video" ? lesson.lessonDuration : "00:00",
            durationSecs:
              lesson.lessonType === "video"
                ? convertDurationToSeconds(lesson.lessonDuration)
                : 0,
          })),
          quizzes: mod.quizzes.map((quiz) => ({
            title: quiz.title,
            questions: quiz.questions.map((question) => ({
              text: question.text,
              type: question.type,
              options: question.options.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
                files: option.files,
                fileNames: option.fileNames,
              })),
              scaleMin: question.scaleMin,
              scaleMax: question.scaleMax,
            })),
          })),
        })),
      };

      formData.append("bodyData", JSON.stringify(bodyData));

      // Add cover image
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      // Collect all video files and metadata
      const videoFiles: File[] = [];
      const videoMetadata: any[] = [];

      modules.forEach((module, moduleIndex) => {
        module.lessons.forEach((lesson, lessonIndex) => {
          if (lesson.lessonVideoFile && lesson.lessonType === "video") {
            videoFiles.push(lesson.lessonVideoFile);
            videoMetadata.push({
              moduleIndex,
              lessonIndex,
              fileName: lesson.lessonVideoFile.name,
              videoIndex: videoFiles.length - 1,
              lessonTitle: lesson.lessonTitle,
              moduleTitle: module.moduleTitle,
              duration: lesson.lessonDuration,
            });
          }
        });
      });

      // Add video files to FormData
      videoFiles.forEach((file) => formData.append("videoUrl", file));

      // Add video metadata
      if (videoMetadata.length > 0) {
        formData.append("videoMetadata", JSON.stringify(videoMetadata));
      }

      // Call API
      const result = await addMicroLearning({ formData }).unwrap();
      console.log("Course creation successful:", result);

      // ✅ Redirect to course details page
      const createdCourseId = result?.data?.id; // adjust if your API returns ID differently
      if (createdCourseId) {
        router.push(`/dashboard/course/${createdCourseId}`);
        return; // stop further execution
      }

      // Reset form (optional if redirect happens immediately)
      setCourseData({
        title: "",
        description: "",
        categoryId: "",
        duration: "",
        price: null,
        instructorId: "",
        instructorEmail: "",
      });
      setModules([
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
      setCoverImageFile(null);
      setCoverImageName("");
      setValidationErrors([]);
    } catch (err: any) {
      console.log("Error creating course:", err);
      const errorMessage =
        err?.data?.message || err?.message || "Unknown error occurred";
      toast(`Error: Failed to create course: ${errorMessage}`);
    }
  };

  return (
    <div className="mx-auto p-6 space-y-8 bg-white">
      <TranslateInitializer />
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-8">
          <div
            onClick={handleCoverClick}
            className="cursor-pointer border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50/30 hover:bg-blue-100 transition"
          >
            {coverImageName ? (
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-blue-500" />
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium text-sm">
                    {coverImageName}
                  </p>
                  <p className="text-xs text-gray-500" data-translate>
                    Click to change cover image
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-medium" data-translate>
                  Upload Cover Image *
                </p>
                <p className="text-sm text-gray-500 mt-2" data-translate>
                  Recommended: 1200x600px, JPG or PNG
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            className="hidden"
            accept="image/*"
          />
        </CardContent>
      </Card>

      {/* Course Details */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900" data-translate>
          Course Details
        </h2>
        <div className="space-y-4 border-2 border-gray-100 p-4 rounded-lg">
          <div>
            <label
              className="block text-sm font-medium text-[#585858] mb-2"
              data-translate
            >
              Course Title *
            </label>
            <Input
              placeholder="Write title"
              value={courseData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#585858] mb-2"
              data-translate
            >
              Description *
            </label>
            <Editor
              contents={courseData.description}
              onSave={handleDescriptionChange}
              onBlur={() => {}}
              data-translate
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                data-translate
              >
                Course Category *
              </label>
              <Select
                value={courseData.categoryId}
                onValueChange={(value) =>
                  handleInputChange("categoryId", value)
                }
                data-translate
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {isCategoriesLoading ? (
                    <Spin indicator={<LoadingOutlined spin />} />
                  ) : (
                    categories.map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                data-translate
              >
                Course Duration *
              </label>
              <div className="relative">
                <Input
                  value={courseData.duration}
                  placeholder="HH:MM"
                  maxLength={5}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/[^\d:]/g, "");
                    if (value.length === 2 && !value.includes(":")) {
                      value = value + ":";
                    }
                    if (value.length > 5) value = value.slice(0, 5);

                    handleInputChange("duration", value);

                    // Convert to seconds
                    const [hoursStr, minutesStr] = value.split(":");
                    const hours = parseInt(hoursStr || "0", 10);
                    const minutes = parseInt(minutesStr || "0", 10);

                    const seconds =
                      isNaN(hours) || isNaN(minutes)
                        ? 0
                        : hours * 3600 + minutes * 60;

                    // Update seconds field
                    handleInputChange("durationSecs", seconds);
                  }}
                />
                <TimerIcon className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                data-translate
              >
                Price (€) *
              </label>
              <Input
                type="number"
                placeholder="0"
                value={courseData.price !== null ? courseData.price : ""} // <-- show empty if null
                onChange={(e) =>
                  handleInputChange(
                    "price",
                    e.target.value === "" ? null : Number(e.target.value) // <-- store null if empty
                  )
                }
                className="w-full"
                min="0"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <CourseModuleAdd
        modules={modules}
        setModules={setModules}
        isMicroLearning={isMicroLearning}
      />

      {/* Instructor */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900" data-translate>
          Instructor Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              data-translate
            >
              Instructor Name *
            </label>
            <Select
              value={courseData.instructorId}
              onValueChange={(value) => {
                // Find the selected instructor
                const selectedInstructor = instructors.find(
                  (ins: { id: string }) => ins.id === value
                );

                // Update both instructor ID and email
                handleInputChange("instructorId", value);
                if (selectedInstructor) {
                  handleInputChange(
                    "instructorEmail",
                    selectedInstructor.email
                  );
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent>
                {isInstructorsLoading ? (
                  <Spin indicator={<LoadingOutlined spin />} />
                ) : (
                  instructors.map((ins: Instructor) => (
                    <SelectItem key={ins.id} value={ins.id}>
                      {ins.username}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              data-translate
            >
              Instructor Email *
            </label>
            <Input
              disabled
              type="email"
              placeholder="Write here"
              value={courseData.instructorEmail}
              onChange={(e) =>
                handleInputChange("instructorEmail", e.target.value)
              }
              className="w-full"
              required
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSubmitting}
        className="w-full bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer py-3 text-lg font-medium"
      >
        {isSubmitting ? "Creating Course..." : "Save Course"}
      </Button>
    </div>
  );
}
