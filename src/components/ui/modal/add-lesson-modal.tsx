"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Form, Input, Select, Button, Upload, message, InputNumber } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useAddCourseLessonMutation } from "@/redux/features/courses/coursesApi"
import Editor from "@/components/ui/Editor/Editor"

const { TextArea } = Input
const { Option } = Select

interface AddLessonModalProps {
  visible: boolean
  onCancel: () => void
  courseId: string
}

interface LessonFormData {
  title: string
  type: "video" | "document" | "quiz"
  description: string
  duration: string
  durationSecs: number
  videoUrl?: string
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({ visible, onCancel, courseId }) => {
  const [form] = Form.useForm()
  const [addLesson, { isLoading }] = useAddCourseLessonMutation()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [editorContent, setEditorContent] = useState<string>("")

  const handleSubmit = async (values: LessonFormData) => {
    try {
      const formData = new FormData()

      // Add lesson data
      formData.append("title", values.title)
      formData.append("type", values.type)
      const description = values.type === "document" ? editorContent : values.description
      formData.append("description", description)
      formData.append("duration", values.duration)
      formData.append("durationSecs", values.durationSecs.toString())

      if (values.videoUrl) {
        formData.append("videoUrl", values.videoUrl)
      }

      if (videoFile) {
        formData.append("video", videoFile)
      }

      if (documentFile) {
        formData.append("document", documentFile)
      }

      await addLesson({
        id: courseId,
        formData,
      }).unwrap()

      message.success("Lesson added successfully!")
      form.resetFields()
      setVideoFile(null)
      setDocumentFile(null)
      setEditorContent("")
      setUploadProgress(0)
      setIsUploading(false)
      onCancel()
    } catch (error) {
      console.error("Error adding lesson:", error)
      message.error("Failed to add lesson. Please try again.")
    }
  }

  const handleVideoUpload = (file: File) => {
    setVideoFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(
      () => {
        progress += Math.random() * 15 + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setIsUploading(false)
          message.success("Video uploaded successfully!")
        }
        setUploadProgress(Math.min(progress, 100))
      },
      200 + Math.random() * 300,
    )

    return false // Prevent automatic upload
  }

  const handleDocumentUpload = (file: File) => {
    setDocumentFile(file)
    message.success("Document selected successfully!")
    return false // Prevent automatic upload
  }

  const convertTimeToSeconds = (timeString: string): number => {
    const [minutes, seconds] = timeString.split(":").map(Number)
    return (minutes || 0) * 60 + (seconds || 0)
  }

  const handleDurationChange = (value: string) => {
    const seconds = convertTimeToSeconds(value)
    form.setFieldsValue({ durationSecs: seconds })
  }

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
  }

  return (
    <Modal title="Add New Lesson" open={visible} onCancel={onCancel} footer={null} width={700} destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: "video",
          duration: "00:00",
          durationSecs: 0,
        }}
      >
        <Form.Item name="title" label="Lesson Title" rules={[{ required: true, message: "Please enter lesson title" }]}>
          <Input placeholder="e.g., Lesson 1 - Intro to Express.js" />
        </Form.Item>

        <Form.Item name="type" label="Lesson Type" rules={[{ required: true, message: "Please select lesson type" }]}>
          <Select placeholder="Select lesson type">
            <Option value="video">Video</Option>
            <Option value="document">Document</Option>
            <Option value="quiz">Quiz</Option>
          </Select>
        </Form.Item>

        <Form.Item dependencies={["type"]}>
          {({ getFieldValue }) => {
            const lessonType = getFieldValue("type")

            if (lessonType === "document") {
              return (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Description</label>
                  <Editor contents={editorContent} onSave={handleEditorChange} onBlur={() => {}} />
                </div>
              )
            }

            return (
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter lesson description" }]}
              >
                <TextArea rows={3} placeholder="e.g., This lesson introduces Express.js basics." />
              </Form.Item>
            )
          }}
        </Form.Item>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="duration"
            label="Duration (MM:SS)"
            rules={[{ required: true, message: "Please enter duration" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="07:00" onChange={(e) => handleDurationChange(e.target.value)} />
          </Form.Item>

          <Form.Item name="durationSecs" label="Duration (Seconds)" style={{ flex: 1 }}>
            <InputNumber min={0} placeholder="420" style={{ width: "100%" }} disabled />
          </Form.Item>
        </div>

        <Form.Item dependencies={["type"]}>
          {({ getFieldValue }) => {
            const lessonType = getFieldValue("type")

            if (lessonType === "video") {
              return (
                <>
                  <Form.Item name="videoUrl" label="Video URL (Optional)">
                    <Input placeholder="https://example.com/video.mp4" />
                  </Form.Item>

                  <Form.Item label="Upload Video File (Optional)">
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
                        setVideoFile(null)
                        setUploadProgress(0)
                        setIsUploading(false)
                      }}
                    >
                      <Button icon={<UploadOutlined />} disabled={isUploading}>
                        {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Select Video File"}
                      </Button>
                    </Upload>
                    {isUploading && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ width: "100%", backgroundColor: "#f0f0f0", borderRadius: "4px", height: "8px" }}>
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
                  </Form.Item>
                </>
              )
            }

            if (lessonType === "document") {
              return (
                <Form.Item label="Upload Document File (Optional)">
                  <Upload
                    beforeUpload={handleDocumentUpload}
                    maxCount={1}
                    accept=".pdf,.doc,.docx,.txt"
                    fileList={documentFile ? [{ uid: "1", name: documentFile.name, status: "done" }] : []}
                    onRemove={() => setDocumentFile(null)}
                  >
                    <Button icon={<UploadOutlined />}>Select Document File</Button>
                  </Upload>
                </Form.Item>
              )
            }

            return null
          }}
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Add Lesson
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
