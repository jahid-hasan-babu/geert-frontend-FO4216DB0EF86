"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddInstructorModalProps {
  courseId: string;
  onAddSuccess: () => void;
}

export default function AddMemberModal({ courseId, onAddSuccess }: AddInstructorModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/add-student`,
        {
          email,
          courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmail("");
      setOpen(false);
      onAddSuccess?.(); // Refresh course data
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error(error);
      setError(error?.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3399CC] hover:bg-[#3399CC] cursor-pointer text-white">
          + Add Member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3399CC] hover:bg-[#52b9ec] text-white py-3 rounded-lg font-medium"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
