/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAddCourseLessonMutation } from "@/redux/features/courses/coursesApi";
import Editor from "@/components/ui/Editor/Editor";
import { toast } from "sonner";

const { TextArea } = Input;
const { Option } = Select;

export interface QuizOption {
  id: string;
  text: string;
  value?: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: "SINGLE_CHOICE" | "MULTI_CHOICE" | "ORDERING" | "SCALE" | "TEXT";
  options?: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Lesson {
  id: string;
  type: "video" | "doc";
  title: string;
  description: string;
  duration: string;
  durationSecs: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

export interface Course {
  id: string;
  title: string;
  coverImage: string;
  duration: string;
  price: string;
  totalRaters: number;
  avgRating: number;
  totalLessons: number;
  isFavorite: boolean;
  isMicroLearning?: boolean;
  modules: Module[];
}

interface AddLessonModalProps {
  visible: boolean;
  onCancel: () => void;
  courseId: string;
  modu: Module[];
}

interface LessonFormData {
  title: string;
  type: "video" | "doc" | "quiz";
  description: string;
  duration: string;
  durationSecs: number;
  moduleId: string;
  editorContent?: string;
}

interface ApiError {
  data?: {
    message?: string;
    errorMessages?: { path: string; message: string }[];
    err?: {
      code?: string;
      field?: string;
      name?: string;
    };
  };
  message?: string;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  visible,
  onCancel,
  modu,
}) => {
  const [form] = Form.useForm<LessonFormData>();
  const [addLesson, { isLoading }] = useAddCourseLessonMutation();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>("");

  const resetForm = (): void => {
    form.resetFields();
    setVideoFile(null);
    setEditorContent("");
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleVideoUpload = (file: File): boolean => {
    const isVideo = file.type.startsWith("video/");
    if (!isVideo) {
      toast.error("Please upload a valid video file!");
      return false;
    }

    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      toast.error("Video must be smaller than 100MB!");
      return false;
    }

    setVideoFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Extract video duration
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const totalSeconds = Math.floor(video.duration);

      const hours = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (totalSeconds % 60).toString().padStart(2, "0");

      form.setFieldsValue({
        duration: `${hours}:${minutes}:${seconds}`,
        durationSecs: totalSeconds,
      });

      setIsUploading(false);
      toast.success("Video file selected successfully!");
      URL.revokeObjectURL(video.src);
    };

    return false; // Prevent automatic upload
  };

  // Handler for editor changes
  const handleEditorChange = (content: string): void => {
    setEditorContent(content);
    form.setFieldsValue({ editorContent: content });
  };

  const handleSubmit = async (values: LessonFormData): Promise<void> => {
    try {
      const formData = new FormData() as any;

      // Basic lesson fields
      formData.append("title", values.title);
      formData.append("type", values.type);

      // ✅ Description handling
      const description =
        values.type === "doc" ? editorContent || "" : values.description || "";
      formData.append("description", description);

      // ✅ Duration handling
      const duration =
        values.duration && values.duration !== "undefined"
          ? values.duration
          : null;
      const durationSecs =
        values.durationSecs !== undefined && values.durationSecs !== null
          ? values.durationSecs
          : null;

      if (duration !== null) {
        formData.append("duration", duration);
      }
      if (durationSecs !== null) {
        formData.append("durationSecs", String(durationSecs));
      }

      // Module ID
      formData.append("moduleId", values.moduleId);

      // Files
      if (videoFile && values.type === "video") {
        formData.append("videoUrl", videoFile);
      }

      // Submit
      const result = await addLesson({
        id: values.moduleId,
        formData,
      }).unwrap();

      if (result?.success) {
        toast.success(<span data-translate>Lesson added successfully!</span>);
        resetForm();
        onCancel();
      } else {
        toast.error("Failed to add lesson. Please try again.");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error adding lesson:", apiError);

      if (apiError?.data?.err?.name === "PrismaClientValidationError") {
        const errorMessage =
          apiError.data.errorMessages?.[0]?.message ||
          "Invalid data provided. Please check your inputs.";
        toast.error(`Validation error: ${errorMessage}`);
      } else if (apiError?.data?.err?.code === "LIMIT_UNEXPECTED_FILE") {
        const fieldName = apiError?.data?.err?.field || "unknown";
        toast.error(
          `File upload failed: Backend doesn't expect field "${fieldName}". Please check backend Multer config.`
        );
      } else if (apiError?.data?.message) {
        toast.error(apiError.data.message);
      } else if (apiError?.message) {
        toast.error(apiError.message);
      } else {
        toast.error("Failed to add lesson. Please try again.");
      }
    }
  };

  const handleCancel = (): void => {
    resetForm();
    onCancel();
  };

  return (
    <Modal
      title="Add New Lesson"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width="90%"
      style={{ maxWidth: 700 }}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: "video",
          duration: "00:00",
          durationSecs: 0,
          editorContent: "",
          moduleId: "",
        }}
      >
        <Form.Item
          name="title"
          label="Lesson Title"
          rules={[
            { required: true, message: "Please enter lesson title" },
            { min: 3, message: "Title must be at least 3 characters" },
            { max: 100, message: "Title must be less than 100 characters" },
          ]}
        >
          <Input placeholder="e.g., Lesson 1 - Intro to Express.js" />
        </Form.Item>

        <Form.Item
          name="moduleId"
          label="Select Module"
          rules={[{ required: true, message: "Please select a module" }]}
        >
          <Select placeholder="Select Module">
            {modu.map((mod) => (
              <Option key={mod.id} value={mod.id}>
                {mod.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Lesson Type"
          rules={[{ required: true, message: "Please select lesson type" }]}
        >
          <Select placeholder="Select lesson type">
            <Option value="video">Video</Option>
            <Option value="doc">Document</Option>
          </Select>
        </Form.Item>

        <Form.Item dependencies={["type"]}>
          {({ getFieldValue }) => {
            const lessonType = getFieldValue("type");

            if (lessonType === "doc") {
              return (
                <Form.Item
                  name="editorContent"
                  label="Lesson Content"
                  rules={[
                    {
                      required: true,
                      message: "Please add content for the document",
                      validator: () => {
                        if (!editorContent.trim()) {
                          return Promise.reject(
                            new Error("Please add content for the document")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Editor
                    contents={editorContent}
                    onSave={handleEditorChange}
                    onBlur={() => {}}
                  />
                </Form.Item>
              );
            }

            return (
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter lesson description",
                  },
                  {
                    min: 10,
                    message: "Description must be at least 10 characters",
                  },
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="e.g., This lesson introduces Express.js basics and covers routing fundamentals."
                />
              </Form.Item>
            );
          }}
        </Form.Item>

        <Form.Item dependencies={["type"]}>
          {({ getFieldValue }) => {
            const lessonType = getFieldValue("type");
            if (lessonType === "video") {
              return (
                <div style={{ display: "flex", gap: "16px" }}>
                  <Form.Item
                    name="duration"
                    label="Duration (HH:MM:SS)"
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="Upload Video First" disabled />
                  </Form.Item>
                </div>
              );
            }
            return null;
          }}
        </Form.Item>

        <Form.Item dependencies={["type"]}>
          {({ getFieldValue }) => {
            const lessonType = getFieldValue("type");

            if (lessonType === "video") {
              return (
                <Form.Item
                  name="videoFile"
                  label="Upload Video File"
                  rules={[
                    {
                      required: true,
                      message: "Please upload a video file",
                      validator: () => {
                        if (!videoFile) {
                          return Promise.reject(
                            new Error("Please upload a video file")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Upload
                    beforeUpload={handleVideoUpload}
                    maxCount={1}
                    accept="video/*"
                    fileList={
                      videoFile
                        ? [
                            {
                              uid: "1",
                              name: videoFile.name,
                              status: isUploading ? "uploading" : "done",
                              percent: uploadProgress,
                            },
                          ]
                        : []
                    }
                    onRemove={() => {
                      setVideoFile(null);
                      setUploadProgress(0);
                      setIsUploading(false);
                    }}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      disabled={isUploading}
                      type={videoFile ? "default" : "dashed"}
                    >
                      {isUploading
                        ? `Processing... ${Math.round(uploadProgress)}%`
                        : videoFile
                        ? "Change Video File"
                        : "Upload Video File"}
                    </Button>
                  </Upload>

                  {isUploading && (
                    <div style={{ marginTop: 8 }}>
                      <div
                        style={{
                          width: "100%",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "4px",
                          height: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: `${uploadProgress}%`,
                            backgroundColor: "#1890ff",
                            height: "100%",
                            borderRadius: "4px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {videoFile && (
                    <div className="mt-2 p-2 bg-green-50 rounded">
                      <div className="text-green-700 text-sm">
                        ✓ Video selected: {videoFile.name} (
                        {(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                      </div>
                    </div>
                  )}

                  <div className="text-gray-500 text-sm mt-1">
                    Supported formats: MP4, AVI, MOV, WMV, FLV (Max 100MB)
                  </div>
                </Form.Item>
              );
            }

            return null;
          }}
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0, textAlign: "right", marginTop: 24 }}
        >
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isUploading}
          >
            {isLoading ? "Adding Lesson..." : "Add Lesson"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
