"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface CourseProgressModalProps {
  current: number;
  total: number;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

// Pre-defined translations to avoid API calls
const TRANSLATIONS = {
  "Your Progress": {
    en: "Your Progress",
    nl: "Jouw voortgang"
  }
};

export function CourseProgressModal({
  current,
  total,
  className = "",
  isOpen,
  onClose,
}: CourseProgressModalProps) {
  const [titleText, setTitleText] = useState("Your Progress");
  const percentage = Math.round((current / total) * 100);

  useEffect(() => {
    const lang = localStorage.getItem("selectedLanguage") || "en";
    const translation = TRANSLATIONS["Your Progress"][lang as keyof typeof TRANSLATIONS["Your Progress"]] || "Your Progress";
    setTitleText(translation);
  }, []);

  // Update translation when modal opens (in case language changed)
  useEffect(() => {
    if (isOpen) {
      const lang = localStorage.getItem("selectedLanguage") || "en";
      const translation = TRANSLATIONS["Your Progress"][lang as keyof typeof TRANSLATIONS["Your Progress"]] || "Your Progress";
      setTitleText(translation);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold">
            {titleText}
          </DialogTitle>
        </DialogHeader>

        <div className={`flex items-center gap-4 mt-6 ${className}`}>
          <span className="text-sm font-medium text-foreground">
            {current}/{total}
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-foreground">
            {percentage}%
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}