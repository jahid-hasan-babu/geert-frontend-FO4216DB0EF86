"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = () => {
    console.log("Review submitted:", { rating, feedback });
    setRating(0);
    setFeedback("");
    onClose();
  };

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex: number) => {
    setHoveredRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-2xl font-semibold">
            Leave Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating Section */}
          <div className="space-y-3">
            <h3 className="text-center text-gray-600 font-medium">
              Select Rating
            </h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                  key={starIndex}
                  type="button"
                  onClick={() => handleStarClick(starIndex)}
                  onMouseEnter={() => handleStarHover(starIndex)}
                  onMouseLeave={handleStarLeave}
                  className="transition-colors duration-150"
                >
                  <Star
                    className={`h-8 w-8 ${
                      starIndex <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-3">
            <h3 className="text-gray-600 font-medium">Write Feedback</h3>
            <Textarea
              placeholder="Write here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
