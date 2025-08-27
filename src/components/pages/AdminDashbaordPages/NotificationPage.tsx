"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationPage() {
  const [sendTo, setSendTo] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // recipients list for mapping
  const recipients = [
    { value: "all", label: "All" },
    { value: "students", label: "Students" },
    { value: "micro", label: "Microlearning Students" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Notification:", { sendTo, title, message });
  };

  return (
    <div className="mx-auto p-6 bg-white">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Make Notification
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Send To
              </label>
              <Select value={sendTo} onValueChange={setSendTo}>
                <SelectTrigger className="w-full h-12 border-gray-200 rounded-lg cursor-pointer">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  {recipients.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title Input */}
            <div>
              <label className="text-sm font-medium text-gray-600">Title</label>
              <Input
                placeholder="Write title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Send Message
            </label>
            <Textarea
              placeholder="Write here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] border-gray-200 rounded-lg resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 bg-[#3399CC] hover:bg-[#61b1da] text-white font-medium rounded-full text-lg cursor-pointer"
        >
          Make Notification
        </Button>
      </form>
    </div>
  );
}
