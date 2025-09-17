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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAddCourseStudentMutation } from "@/redux/features/courses/coursesApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";

interface AddMemberModalProps {
  courseId: string;
  onAddSuccess: () => void;
}

interface AddCourseStudentResponse {
  success: boolean;
  message?: string;
}

export default function AddMemberModal({
  courseId,
  onAddSuccess,
}: AddMemberModalProps) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [addCourseToStudent, { isLoading: isAdding }] =
    useAddCourseStudentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const res: AddCourseStudentResponse = await addCourseToStudent({
        firstName,
        lastName,
        email,
        courseId,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Student added to course successfully");
        setError("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setOpen(false);
        onAddSuccess?.();
      }
    } catch (err) {
      console.error(err);
      let message = "Failed to add student to course";
      if ((err as FetchBaseQueryError)?.status) {
        const fetchErr = err as FetchBaseQueryError;
        if (
          "data" in fetchErr &&
          fetchErr.data &&
          typeof fetchErr.data === "object"
        ) {
          message = (fetchErr.data as { message?: string }).message || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <TranslateInitializer />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" data-translate>
            + Add Student
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <TranslateInitializer />
            <DialogTitle data-translate>Add New Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* First Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right" data-translate>
                  First Name
                </Label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="col-span-3 border rounded px-2 py-1"
                  disabled={isAdding}
                  data-translate
                />
              </div>

              {/* Last Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right" data-translate>
                  Last Name
                </Label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="col-span-3 border rounded px-2 py-1"
                  disabled={isAdding}
                  data-translate
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right" data-translate>
                  Student Email
                </Label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter student email"
                  className="col-span-3 border rounded px-2 py-1"
                  disabled={isAdding}
                  data-translate
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm" data-translate>
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isAdding} data-translate>
                {isAdding ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
