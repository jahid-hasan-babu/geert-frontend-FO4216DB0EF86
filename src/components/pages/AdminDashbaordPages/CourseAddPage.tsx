"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Info } from "lucide-react";
import CourseModuleAdd from "./CourseModuleAdd";

type Lesson = {
  lessonType: "video" | "docs" | "";
  lessonTitle: string;
  lessonDuration: string;
  lessonVideoName: string;
};

type Quiz = {
  question: string;
  answer: string;
  options: string[];
};

type Module = {
  moduleTitle: string;
  lessons: Lesson[];
  quizzes?: Quiz[];
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
  const pathname = usePathname();
  const isMicroLearning =
    pathname === "/dashboard/micro-learning/add-microLearning";

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    categoryId: "",
    duration: "",
    instructorId: "",
    instructorEmail: "",
  });

  const [coverImageName, setCoverImageName] = useState("");
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [modules, setModules] = useState<Module[]>([
    {
      moduleTitle: "",
      lessons: [
        {
          lessonType: "video",
          lessonTitle: "",
          lessonDuration: "",
          lessonVideoName: "",
        },
      ],
      quizzes: [],
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/all-category`,
        config
      )
      .then((res) => {
        console.log("Category response >>>", res.data);
        setCategories(res?.data?.data?.data);
      })
      .catch((err) => console.error("Failed to fetch categories", err));

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/all-users?filter=INSTRUCTOR`,
        config
      )
      .then((res) => {
        console.log("Instructor response >>>", res.data);
        setInstructors(res?.data?.data?.data);
      })
      .catch((err) => console.error("Failed to fetch instructors", err));
  }, []);

  const handleCoverClick = () => coverInputRef.current?.click();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageName(e.target.files[0].name);
      console.log("Selected cover image:", e.target.files[0]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      const bodyData = {
        title: courseData.title,
        description: courseData.description,
        categoryId: courseData.categoryId,
        duration: courseData.duration,
        instructorId: courseData.instructorId,
        modules: modules.map((mod) => ({
          title: mod.moduleTitle,
          lessons: mod.lessons.map((lesson) => ({
            type: lesson.lessonType,
            title: lesson.lessonTitle,
            description: "",
            duration: lesson.lessonDuration,
            durationSecs: 0,
          })),
          quizzes:
            mod.quizzes?.map((quiz) => ({
              title: quiz.question,
              questions:
                quiz.options?.map((opt) => ({
                  text: opt,
                  isCorrect: false,
                })) || [],
            })) || [],
        })),
        isMicroLearning: isMicroLearning,
      };

      formData.append("bodyData", JSON.stringify(bodyData));

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/create-course`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Course created:", res.data);
      alert("Course created successfully!");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert("Error creating course");
    }
  };

  return (
    <div className="mx-auto p-6 space-y-8 bg-white">
      <Card>
        <CardContent className="p-8">
          <div
            onClick={handleCoverClick}
            className="cursor-pointer border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50/30 hover:bg-blue-100 transition"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 font-medium">
              {coverImageName ? coverImageName : "Upload Cover Image"}
            </p>
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
        <h2 className="text-2xl font-semibold text-gray-900">Course Details</h2>
        <div className="space-y-4 border-2 border-gray-100 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-[#585858] mb-2">
              Course Title
            </label>
            <Input
              placeholder="Write title"
              value={courseData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#585858] mb-2">
              Description
            </label>
            <Textarea
              placeholder="Write course description..."
              value={courseData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Category
              </label>
              <Select
                value={courseData.categoryId}
                onValueChange={(value) =>
                  handleInputChange("categoryId", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Write category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Duration
              </label>
              <div className="relative">
                <Select
                  value={courseData.duration}
                  onValueChange={(value) =>
                    handleInputChange("duration", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hr">1 hour</SelectItem>
                    <SelectItem value="2hr">2 hours</SelectItem>
                    <SelectItem value="3hr">3 hours</SelectItem>
                    <SelectItem value="5hr30m">5 hr 30m</SelectItem>
                    <SelectItem value="10hr">10 hours</SelectItem>
                  </SelectContent>
                </Select>
                <Info className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
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
        <h2 className="text-2xl font-semibold text-gray-900">
          Instructor Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor Name
            </label>
            <Select
              value={courseData.instructorId}
              onValueChange={(value) =>
                handleInputChange("instructorId", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Write here" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((ins) => (
                  <SelectItem key={ins.id} value={ins.id}>
                    {ins.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor Email
            </label>
            <Input
              type="email"
              placeholder="Write here"
              value={courseData.instructorEmail}
              onChange={(e) =>
                handleInputChange("instructorEmail", e.target.value)
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-[#3399CC] hover:bg-[#52b9ec] cursor-pointer py-3 text-lg font-medium"
      >
        Save
      </Button>
    </div>
  );
}
