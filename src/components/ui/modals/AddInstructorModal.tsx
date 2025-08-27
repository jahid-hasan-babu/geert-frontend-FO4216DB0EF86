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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface AddInstructorModalProps {
  onAdd: (instructor: {
    username: string;
    email: string;
    designation: string;
    image: File | null;
  }) => void;
}

export default function AddInstructorModal({ onAdd }: AddInstructorModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    designation: "",
    image: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setOpen(false); // close modal
    setFormData({ username: "", email: "", designation: "", image: null });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, image: file }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3399CC] hover:bg-[#3399CC] text-white cursor-pointer">
          + Add Instructor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Instructor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Name</Label>
            <Input
              id="username"
              placeholder="Enter name"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              placeholder="Enter designation"
              value={formData.designation}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, designation: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="relative">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">
                  {formData.image ? formData.image.name : "Upload Image"}
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3399CC] hover:bg-[#3399CC] text-white py-3 rounded-lg font-medium cursor-pointer"
          >
            Add Instructor
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
