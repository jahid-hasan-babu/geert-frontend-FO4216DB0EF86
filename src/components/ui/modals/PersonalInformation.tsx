"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Upload } from "lucide-react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    profileImage?: string | null;
  };
}

export function PersonalInfoModal({
  isOpen,
  onClose,
  user,
}: PersonalInfoModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    gender: "Male",
    profilePhoto: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || "",
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        birthDate: user.dateOfBirth || "",
        gender: user.gender || "Male",
        profilePhoto: null,
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, profilePhoto: file }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append(
        "bodyData",
        JSON.stringify({
          username: formData.name,
          phone: formData.phone,
          address: formData.address,
          gender: formData.gender,
          dateOfBirth: formData.birthDate,
        })
      );
      if (formData.profilePhoto)
        formPayload.append("profileImage", formData.profilePhoto);

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/update`,
        formPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        onClose();
        // Reload page after successful update
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto p-6">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            Personal Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Address
            </Label>
            <div className="relative">
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full pr-10"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Profile Photo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Profile Photo
            </Label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-blue-600 font-medium">Tap to upload photo</p>
              </label>
              {formData.profilePhoto && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.profilePhoto.name}
                </p>
              )}
            </div>
          </div>

          {/* Birth Date & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="birthDate"
                className="text-sm font-medium text-gray-700"
              >
                Date of Birth
              </Label>
              <DatePicker
                selected={
                  formData.birthDate ? new Date(formData.birthDate) : null
                }
                onChange={(date: Date | null) =>
                  handleInputChange(
                    "birthDate",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date"
                className="w-full border rounded-lg px-3 py-2"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 mt-6 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
