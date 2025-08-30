"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Wifi } from "lucide-react";
import Image from "next/image";
import axios from "axios";

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorId: string;
}

interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  lessons?: number;
  duration?: string;
  rating?: number;
  reviewCount?: number;
}

interface InstructorInfo {
  id: string;
  name: string;
  profileImage?: string;
  bio?: string;
  totalCourses: number;
  totalStudents: number;
  totalReviews: number;
}

export function InstructorModal({
  isOpen,
  onClose,
  instructorId,
}: InstructorModalProps) {
  const [info, setInfo] = useState<InstructorInfo | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && instructorId) {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/single-instructor/${instructorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          console.log("Response", res);
          setInfo(res.data.data.data.instructor);
          setCourses(res.data.data.data.course);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, instructorId]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white">
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-2xl font-bold text-center flex-1 font-playfairDisplay">
            Instructor
          </h2>
        </div>

        {loading || !info ? (
          <p className="text-center p-6">Loading...</p>
        ) : (
          <div className="px-6 pb-6 text-center">
            {/* Profile */}
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
              <Image
                src={info.profileImage || "/placeholder.svg"}
                alt={info.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">{info.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">{info.bio}</p>

            {/* Stats */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{info.totalCourses}</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{info.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{info.totalReviews}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
            </div>

            {/* About Section */}
            {info?.bio && (
              <div className="text-left">
                <h4 className="font-semibold mb-3">About Instructor</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {info.bio}
                </p>
              </div>
            )}

            {/* Courses */}
            {courses.length > 0 && (
              <div className="mt-6 text-left">
                <h4 className="font-semibold mb-3">
                  {info.name.split(" ")[0]}&#39;s Courses
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {courses.map((c) => (
                    <Card key={c.id} className="border border-gray-200">
                      <CardContent className="p-4 flex gap-3">
                        {/* Course Icon */}
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
                              <div className="w-4 h-3 bg-yellow-400 rounded-xs"></div>
                            </div>
                          </div>
                          <div className="absolute -top-1 -right-1">
                            <Wifi className="w-4 h-4 text-orange-500" />
                          </div>
                        </div>

                        {/* Course Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {c.rating ?? 4.9} ({c.reviewCount ?? 0})
                            </span>
                            {/* <Heart className="w-4 h-4 text-gray-400 ml-auto" /> */}
                          </div>
                          <h5 className="font-semibold text-sm mb-1">
                            {c.title}
                          </h5>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">
                              {c.lessons ?? 0} Lessons, {c.duration ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
