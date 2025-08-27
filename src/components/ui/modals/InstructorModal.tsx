"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { X, Star, Heart } from "lucide-react"

interface Course {
  id: string
  title: string
  thumbnail: string
  rating: number
  reviewCount: number
  lessons: number
  duration: string
}

interface Instructor {
  name: string
  avatar: string | StaticImageData
  bio?: string
  credentials?: string
  coursesCount?: number
  studentsCount?: number
  reviewsCount?: number
  courses?: Course[]
}

interface InstructorModalProps {
  isOpen: boolean
  onClose: () => void
  instructor: Instructor
}

export default function InstructorModal({ isOpen, onClose, instructor }: InstructorModalProps) {
  const [showFullBio, setShowFullBio] = useState(false)

  const truncatedBio =
    instructor.bio && instructor.bio.length > 150 ? instructor.bio.substring(0, 150) + "..." : instructor.bio

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center p-6 pb-4">
                <Dialog.Title className="text-2xl font-bold text-gray-900">Instructor</Dialog.Title>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-200">
                    <Image
                      src={instructor.avatar || "/placeholder.svg"}
                      alt={instructor.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                  {instructor.credentials && <p className="text-sm text-gray-600 mb-6">{instructor.credentials}</p>}
                </div>

                {/* Stats Section */}
                {(instructor.coursesCount || instructor.studentsCount || instructor.reviewsCount) && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{instructor.coursesCount || 0}</div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.studentsCount?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructor.reviewsCount?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                  </div>
                )}

                {/* About Section */}
                {instructor.bio && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">About Instructor</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {showFullBio ? instructor.bio : truncatedBio}
                      {instructor.bio && instructor.bio.length > 150 && (
                        <button
                          onClick={() => setShowFullBio(!showFullBio)}
                          className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                        >
                          {showFullBio ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </p>
                  </div>
                )}

                {/* Courses Section */}
                {instructor.courses && instructor.courses.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Courses</h4>
                    <div className="space-y-3">
                      {instructor.courses.map((course) => (
                        <div key={course.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0">
                            <Image
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {course.rating} ({course.reviewCount})
                              </span>
                            </div>
                            <h5 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{course.title}</h5>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>
                                {course.lessons} Lessons, {course.duration}
                              </span>
                            </div>
                          </div>
                          <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 cursor-pointer flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
