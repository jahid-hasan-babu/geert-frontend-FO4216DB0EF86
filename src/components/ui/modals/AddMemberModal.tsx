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

export default function AddMemberModal({ courseId, onAddSuccess }: AddMemberModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [addCourseToStudent, { isLoading: isAdding }] = useAddCourseStudentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a student email");
      window.dispatchEvent(new Event("translate-refresh")); // refresh translation for error
      return;
    }

    try {
      const res: AddCourseStudentResponse = await addCourseToStudent({ email, courseId }).unwrap();

      if (res.success) {
        toast.success(res.message || "Student added to course successfully");
        setError("");
        setEmail("");
        setOpen(false);
        onAddSuccess?.();
      }
    } catch (err) {
      console.error(err);

      let message = "Failed to add student to course";

      if ((err as FetchBaseQueryError)?.status) {
        const fetchErr = err as FetchBaseQueryError;
        if ("data" in fetchErr && fetchErr.data && typeof fetchErr.data === "object") {
          message = (fetchErr.data as { message?: string }).message || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      toast.error(message);
      window.dispatchEvent(new Event("translate-refresh")); // refresh translation for error
    }
  };

  return (
    <>
      <TranslateInitializer />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" data-translate>
            + Add Member
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <TranslateInitializer />
            <DialogTitle data-translate>Add New Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
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
