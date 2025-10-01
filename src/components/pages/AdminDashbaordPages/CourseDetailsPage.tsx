/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetCourseByIdQuery,
  useEditCourseMutation,
  useDeleteCourseMutation,
  useEditModuleMutation,
  useEditLessonMutation,
  useDeleteLessonMutation,
  useGetStudentsInCourseQuery,
} from "@/redux/features/courses/coursesApi";
import AddModuleModal from "@/components/ui/modal/add-module-modal";
import { AddLessonModal } from "@/components/ui/modal/add-lesson-modal";
import type { Module, Lesson } from "@/components/ui/modal/add-lesson-modal";
import Editor from "@/components/ui/Editor/Editor";
import AddMemberModal from "@/components/ui/modals/AddMemberModal";
import { Dialog } from "@headlessui/react";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";
import { useRouter } from "next/navigation";

interface Instructor {
  id: string;
  username: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  duration: string;
  category: Category;
  price: number;
  avgRating: number;
  isMicroLearning: boolean;
  instructor: Instructor;
  modules: Module[];
  totalStudents: number;
}

interface Student {
  userId: string | number;
  user?: {
    username?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
  };
}

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModuleModalVisible, setIsModuleModalVisible] = useState(false);
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: 0,
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // Add this inside your component, after the other hooks
  const router = useRouter();

  const { data, isLoading } = useGetCourseByIdQuery(id);
  const { data: studentsData, isLoading: studentIsLoading } =
    useGetStudentsInCourseQuery(id);
  console.log("Students Data", studentsData);
  const [editCourse, { isLoading: isEditing }] = useEditCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [editModule] = useEditModuleMutation();
  const [editLesson] = useEditLessonMutation();
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [isEditingModule, setIsEditingModule] = useState(false);

  const [editingModule, setEditingModule] = useState<{
    moduleId: string;
    title: string;
  } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    moduleId: string;
    lesson: Lesson;
  } | null>(null);

  const [editModuleTitle, setEditModuleTitle] = useState("");
  const [editLessonData, setEditLessonData] = useState({
    title: "",
    description: "",
    duration: "",
    durationSecs: 0, // <--- new
    videoUrl: null as File | null,
  });

  const [deleteLesson] = useDeleteLessonMutation();
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [deleteLessonModalOpen, setDeleteLessonModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<{
    lessonId: string;
    lessonTitle: string;
  } | null>(null);

  const handleDeleteLessonClick = (lessonId: string, lessonTitle: string) => {
    setLessonToDelete({ lessonId, lessonTitle });
    setDeleteLessonModalOpen(true);
  };

  const handleDeleteLessonSubmit = async () => {
    if (!lessonToDelete) return;
    setDeletingLessonId(lessonToDelete.lessonId);
    try {
      await deleteLesson({ lessonId: lessonToDelete.lessonId }).unwrap();
      setDeleteLessonModalOpen(false);
      setLessonToDelete(null);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    } finally {
      setDeletingLessonId(null);
    }
  };

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
        price: Number(formData.price),
      };

      if (coverImageFile) {
        const submitData = new FormData();
        submitData.append("bodyData", JSON.stringify(bodyData));
        submitData.append("coverImage", coverImageFile);

        await editCourse({ id: course?.id, formData: submitData }).unwrap();
      } else {
        await editCourse({ id: course?.id, formData: bodyData }).unwrap();
      }

      setIsEditMode(false);
    } catch (error) {
      console.log(error);
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

  const handleAddModule = () => setIsModuleModalVisible(true);
  const handleAddLesson = () => setIsLessonModalVisible(true);
  const handleModuleSuccess = () => window.location.reload();
  const handleLessonSuccess = () => window.location.reload();
  const handleDeleteCourse = async () => {
    if (!course?.id) {
      console.error("No course ID found");
      return;
    }

    console.log("Starting delete process for course ID:", course.id);
    console.log("Course object:", course);

    try {
      console.log("Calling deleteCourse mutation...");

      const result = await deleteCourse(course.id).unwrap();

      console.log("Delete successful, result:", result);
      setIsDeleteModalOpen(false);

      // Use Next.js router instead of window.location
      router.push("/dashboard/course");
    } catch (error: unknown) {
      console.error("Delete failed with error:", error);
      if (typeof error === "object" && error !== null) {
        const err = error as {
          status?: string;
          data?: { message?: string };
          message?: string;
        };
        console.error("Error details:", {
          status: err?.status,
          data: err?.data,
          message: err?.message,
        });

        // Show user-friendly error message
        alert(
          `Failed to delete course: ${
            err?.data?.message || err?.message || "Unknown error"
          }`
        );
      } else {
        alert("Failed to delete course: Unknown error");
      }
    }
  };

  const handleEditModuleClick = (moduleId: string, currentTitle: string) => {
    setEditingModule({ moduleId, title: currentTitle });
    setEditModuleTitle(currentTitle);
  };

  const handleEditModuleSubmit = async () => {
    if (!editingModule) return;
    setIsEditingModule(true);
    try {
      await editModule({
        moduleId: editingModule.moduleId,
        title: editModuleTitle,
      }).unwrap();
      setEditingModule(null);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditingModule(false);
    }
  };

  const handleEditLessonClick = (moduleId: string, lesson: Lesson) => {
    setEditingLesson({ moduleId, lesson });
    setEditLessonData({
      title: lesson?.title,
      description: lesson?.description,
      duration: lesson?.duration,
      videoUrl: null,
      durationSecs: lesson?.durationSecs,
    });
  };

  const handleEditLessonSubmit = async () => {
    if (!editingLesson) return;
    setIsEditingLesson(true);

    try {
      const formData = new FormData();
      const { title, description, duration, durationSecs, videoUrl } =
        editLessonData;

      formData.append(
        "bodyData",
        JSON.stringify({ title, description, duration, durationSecs })
      );

      if (videoUrl) {
        formData.append("videoUrl", videoUrl);
      }

      await editLesson({
        moduleId: editingLesson.moduleId,
        lessonId: editingLesson.lesson.id,
        formData,
      }).unwrap();

      setEditingLesson(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditingLesson(false);
    }
  };

  console.log("Editing Lesson", editingLesson);

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

  const handleAddSuccess = () => {
    console.log("Member added successfully!");
  };

  return (
    <div className="mx-auto bg-white p-6">
      <TranslateInitializer />
      <div className="flex items-center justify-between mb-6">
        <div className="bg-white py-[10px] px-[12px] flex space-x-[4px] text-[14px]">
          <div className="text-[#3399CC]" data-translate>
            Course
          </div>
          <div>/</div>
          <div data-translate>Course Details</div>
        </div>
        <div>
          <AddMemberModal
            courseId={course.id}
            onAddSuccess={handleAddSuccess}
          />
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
        <h1 className="text-2xl font-semibold mb-6" data-translate>
          Course Details
        </h1>
        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              data-translate
            >
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
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              data-translate
            >
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
                onSave={(value: string) =>
                  handleInputChange("description", value)
                }
                onBlur={() => {}}
              />
            ) : (
              <div
                className="bg-gray-50 min-h-[80px] p-2 rounded"
                dangerouslySetInnerHTML={{
                  __html: course?.description || "",
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                data-translate
              >
                Course Category
              </label>
              <Input
                value={course.category.name}
                className="bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                data-translate
              >
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
              <TranslateInitializer />
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                data-translate
              >
                Course Price (€)
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
          <h2 className="text-2xl font-semibold" data-translate>
            Module
          </h2>
          {isEditMode && (
            <div className="flex gap-2">
              <TranslateInitializer />
              <Button
                onClick={handleAddLesson}
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                data-translate
              >
                Add Lesson
              </Button>
              <Button
                onClick={handleAddModule}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                data-translate
              >
                Add Module
              </Button>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible className="space-y-2 pb-5">
          {course?.modules?.map((module, index) => (
            <AccordionItem
              key={module.id}
              value={`module-${module.id}`}
              className="border border-gray-200 rounded-lg"
            >
              <TranslateInitializer />
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
                      className="p-2 border rounded-md bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-gray-800 font-medium">
                          {index + 1}.{idx + 1} {lesson.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {lesson.type === "video"
                            ? `🎥 ${lesson?.duration}`
                            : `📝 ${lesson?.duration}`}
                        </p>
                      </div>
                      {isEditMode && (
                        <div>
                          {editingLesson?.lesson.id === lesson.id ? (
                            <div className="flex flex-col gap-2 w-full">
                              <Input
                                value={editLessonData.title}
                                onChange={(e) =>
                                  setEditLessonData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  }))
                                }
                                placeholder="Lesson Title"
                              />
                              {editingLesson?.lesson?.type === "doc" && (
                                <Editor
                                  contents={editLessonData.description}
                                  onSave={(value: string) =>
                                    setEditLessonData((prev) => ({
                                      ...prev,
                                      description: value,
                                    }))
                                  }
                                  onBlur={() => {}}
                                />
                              )}
                              {editingLesson?.lesson?.type === "video" && (
                                <>
                                  <Input
                                    value={editLessonData.duration}
                                    placeholder="Duration (HH:MM:SS)"
                                    disabled
                                  />
                                  <Input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      if (!file) return;

                                      setEditLessonData((prev) => ({
                                        ...prev,
                                        videoUrl: file,
                                      }));

                                      const video =
                                        document.createElement("video");
                                      video.preload = "metadata";
                                      video.src = URL.createObjectURL(file);

                                      video.onloadedmetadata = () => {
                                        const totalSeconds = Math.floor(
                                          video.duration
                                        );

                                        const hours = Math.floor(
                                          totalSeconds / 3600
                                        )
                                          .toString()
                                          .padStart(2, "0");
                                        const minutes = Math.floor(
                                          (totalSeconds % 3600) / 60
                                        )
                                          .toString()
                                          .padStart(2, "0");
                                        const seconds = (totalSeconds % 60)
                                          .toString()
                                          .padStart(2, "0");

                                        setEditLessonData((prev) => ({
                                          ...prev,
                                          duration: `${hours}:${minutes}:${seconds}`,
                                          durationSecs: totalSeconds, // <--- add this
                                        }));

                                        URL.revokeObjectURL(video.src);
                                      };
                                    }}
                                  />
                                </>
                              )}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={handleEditLessonSubmit}
                                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                                  disabled={false}
                                >
                                  {isEditingLesson ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    "Save"
                                  )}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingLesson(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleEditLessonClick(module.id, lesson)
                                }
                                className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                              >
                                Edit Lesson
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleDeleteLessonClick(
                                    lesson.id,
                                    lesson.title
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 cursor-pointer"
                                disabled={deletingLessonId === lesson.id}
                              >
                                {deletingLessonId === lesson.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {isEditMode && (
                    <div className="mt-2">
                      <TranslateInitializer />
                      {editingModule?.moduleId === module.id ? (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={editModuleTitle}
                            onChange={(e) => setEditModuleTitle(e.target.value)}
                          />
                          <Button
                            size="sm"
                            onClick={handleEditModuleSubmit}
                            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                            disabled={isEditingModule}
                          >
                            {isEditingModule ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingModule(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleEditModuleClick(module.id, module.title)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          data-translate
                        >
                          Edit Module
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="mb-8">
        <TranslateInitializer />
        <h2 className="text-2xl font-semibold mb-6" data-translate>
          Instructor Info
        </h2>
        {course.instructor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                data-translate
              >
                Instructor Name
              </label>
              <Input
                value={course.instructor.username}
                className="bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                data-translate
              >
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
        <TranslateInitializer />
        <h2 className="text-2xl font-semibold mb-6" data-translate>
          Students Info
        </h2>

        <div className="mb-4">
          Total Enrolled Students: {studentsData?.data?.data?.length || 0}
        </div>

        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  #
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Username
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Profile Image
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentsData?.data?.data.map(
                (student: Student, index: number) => (
                  <tr key={student.userId}>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {student?.user?.username || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {student?.user?.email || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {student?.user?.phone || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {student?.user?.profileImage ? (
                        <Image
                          width={24}
                          height={24}
                          src={
                            student.user.profileImage || "/default-avatar.png"
                          }
                          alt={student.user.username || "User Avatar"} // fallback alt
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        {isEditMode ? (
          <div className="flex gap-4">
            <TranslateInitializer />
            <Button
              onClick={handleSubmit}
              disabled={isEditing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
              data-translate
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
              data-translate
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <TranslateInitializer />
            <Button
              onClick={() => setIsEditMode(true)}
              className="w-full bg-[#3399CC] hover:bg-[#52b9ec] text-white py-3 rounded-lg cursor-pointer"
              data-translate
            >
              Edit Course
            </Button>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full bg-red-500 hover:bg-red-700 text-white py-3 rounded-lg cursor-pointer"
              disabled={isDeleting}
              data-translate
            >
              {isDeleting ? "Deleting..." : "Delete Course"}
            </Button>
          </div>
        )}
      </div>
      <Dialog
        open={deleteLessonModalOpen}
        onClose={() => setDeleteLessonModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="bg-white p-6 rounded-lg z-10 max-w-md mx-auto">
          <Dialog.Title className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Confirm Delete Lesson
          </Dialog.Title>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the lesson &quot;
            <span className="font-semibold text-gray-800">
              {lessonToDelete?.lessonTitle}
            </span>
            &quot;? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteLessonModalOpen(false);
                setLessonToDelete(null);
              }}
              disabled={!!deletingLessonId}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-700 text-white flex items-center gap-2"
              onClick={handleDeleteLessonSubmit}
              disabled={!!deletingLessonId}
            >
              {deletingLessonId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Lesson
                </>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="bg-white p-6 rounded-lg z-10 max-w-md mx-auto">
          <Dialog.Title className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Confirm Delete Course
          </Dialog.Title>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the course &quot;
            <span className="font-semibold text-gray-800">{course?.title}</span>
            &quot;? This action will permanently delete the course and all its
            modules and lessons. This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-700 text-white flex items-center gap-2"
              onClick={handleDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Course
                </>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
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
};

export default CourseDetailsPage;
