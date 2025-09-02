"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  canReview: boolean;
}

export function ReviewModal({
  isOpen,
  onClose,
  courseId,
  canReview,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!canReview) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/make-review/${courseId}`,
        { rating, comment: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review submitted!");

      setRating(0);
      setFeedback("");
      onClose();
    } catch (err) {
      console.error("Failed to submit review:", err);

      let errorMessage = "Something went wrong. Please try again.";

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message === "You can't review this course") {
          errorMessage = "Review already submitted";
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!canReview) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-6 text-center">
          <p className="text-gray-600">
            You can leave a review only after completing the course.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <h2 className="text-center text-2xl font-semibold mb-4">
          Leave Review
        </h2>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              aria-label={`${star} star`}
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Feedback */}
        <Textarea
          placeholder="Write your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full min-h-[120px] mb-4 resize-none"
        />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300"
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
