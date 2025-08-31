"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetUserQuery } from "@/redux/features/users&category/usersCategoryApi";
import { toast } from "sonner";
import { useAddCourseStudentMutation } from "@/redux/features/courses/coursesApi";
// import { useAddCourseToStudentMutation, useGetStudentsQuery } from "@/lib/api"; // Adjust path to your RTK Query API slice

interface AddMemberModalProps {
  courseId: string;
  onAddSuccess: () => void;
}

interface Student {
  name: string;
  email: string;
}

export default function AddMemberModal({ courseId, onAddSuccess }: AddMemberModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [error, setError] = useState("");

  // RTK Query hook to fetch students
  const { data, isLoading: isStudentsLoading, error: studentsError } =
      useGetUserQuery({ filter: "STUDENT" });
      const students = data?.data?.data 
  // RTK Query hook to add a student to a course
  const [addCourseToStudent, { isLoading: isAdding }] = useAddCourseStudentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail) {
      setError("Please select a student");
      return;
    }
    try {
     const res =  await addCourseToStudent({
        email: selectedEmail,
        courseId,
      }).unwrap();

      if (res.success) {
        toast.success("Student added to course successfully");
        setError("");
        return;
      }
      setSelectedEmail("");
      setOpen(false);
      onAddSuccess?.(); // Trigger success callback
    } catch (err) {
      console.error(err);
      setError("Failed to add student to course");
      toast.error("Failed to add student to course");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Add Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student" className="text-right">
                Student
              </Label>
              <Select
                value={selectedEmail}
                onValueChange={setSelectedEmail}
                disabled={isStudentsLoading || isAdding}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {isStudentsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading students...
                    </SelectItem>
                  ) : studentsError ? (
                    <SelectItem value="error" disabled>
                      Error loading students
                    </SelectItem>
                  ) : students && students.length > 0 ? (
                    students.map((student: Student) => (
                      <SelectItem key={student.email} value={student.email}>
                        {student.name} ({student.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-students" disabled>
                      No students found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isAdding || isStudentsLoading}>
              {isAdding ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}