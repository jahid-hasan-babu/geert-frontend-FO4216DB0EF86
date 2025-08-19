"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart, Wifi } from "lucide-react"
import instructorImage from "@/assets/images/about_dp.png";

interface InstructorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InstructorModalTwo({ isOpen, onClose }: InstructorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-2xl font-bold text-center flex-1 font-playfairDisplay">Instructor</h2>
        </div>

        {/* Profile Section */}
        <div className="px-6 pb-6 text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage
              src={instructorImage.src}
              alt="Alex Endean"
            />
            <AvatarFallback>AE</AvatarFallback>
          </Avatar>

          <h3 className="text-xl font-bold mb-1">Alex Endean, Ph. D.</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Author, UX Engineer, User Research,
            <br />
            Management Consultant
          </p>

          {/* Stats */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">11</div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3,000</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1,424</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
          </div>

          {/* About Section */}
          <div className="text-left">
            <h4 className="font-semibold mb-3">About Instructor</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Alex Endean is a seasoned UI/UX designer who has worked with top tech companies and startups around the
              world. With more than 8 years in the design industry, he specializes in crafting user-centered digital
              experiences. He&#39;s passionate about teaching and has trained over 3,000 students globally in UI design,
              prototyping, and product thinking...
            </p>
            <button className="text-blue-600 text-sm font-medium hover:underline">Read More</button>
          </div>

          {/* Course Section */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-left">Alex Course</h4>
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
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
                      <span className="text-sm font-medium">4.9 (99)</span>
                      <Heart className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>
                    <h5 className="font-semibold text-sm mb-1">Social Media Marketing Mastery</h5>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">06 Lessons, 2 hr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
