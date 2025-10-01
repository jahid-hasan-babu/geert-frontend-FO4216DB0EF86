"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/ui/pagination/Pagination";
import AddStudentModal from "@/components/ui/modals/AddStudentModal";
import axios from "axios";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Spin } from "antd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Student = {
  id: string;
  username?: string;
  email: string;
  phone?: string;
  profileImage?: string;
  status: "ACTIVE" | "BLOCKED" | string;
};

type StudentCourseItem = {
  createdAt: string;
  course: {
    title: string;
    coverImage?: string | null;
    category: { name: string };
  };
};

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Modal for viewing courses
  const [coursesModalOpen, setCoursesModalOpen] = useState(false);
  const [studentCourses, setStudentCourses] = useState<StudentCourseItem[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const studentsPerPage = 15;

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-users?filter=STUDENT`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(res.data.data.data);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter & paginate
  const filteredStudents = students.filter(
    (student) =>
      (student.username || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const formatSerialNo = (index: number) =>
    String(startIndex + index + 1).padStart(2, "0");

  // Add student handler
  const handleAddStudent = async (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/add-student`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(<span data-translate>Student added successfully!</span>);
        fetchStudents();
      } else {
        toast.error(res.data.message || "Failed to add student");
      }
    } catch {
      toast.error("Failed to add student");
    }
  };

  // Change status
  const changeStatus = async (
    student: Student,
    status: "ACTIVE" | "BLOCKED"
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/update-status/${student.id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, status } : s))
      );

      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Delete student
  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/remove-student/${selectedStudent.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(<span data-translate>Student removed successfully!</span>);
      fetchStudents();
    } catch {
      toast.error("Failed to remove student");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  // Fetch courses for modal
  const handleViewCourses = async (student: Student) => {
    try {
      setCoursesLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses/get-student-courses/${student.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStudentCourses(res.data.data.data || []);
      setCoursesModalOpen(true);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setCoursesLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto">
        {/* Search & Add */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-5xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <AddStudentModal onAdd={handleAddStudent} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border mb-3 lg:mb-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20" data-translate>
                  Serial No
                </TableHead>
                <TableHead data-translate>Name</TableHead>
                <TableHead data-translate>Email</TableHead>
                <TableHead data-translate>Phone</TableHead>
                <TableHead data-translate>Courses</TableHead>
                <TableHead data-translate>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 48 }} spin />
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {formatSerialNo(index)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {student.profileImage ? (
                          <Image
                            src={student.profileImage}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover bg-blue-500"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-medium">
                            {(student.username || student.email).charAt(0)}
                          </div>
                        )}
                        <span className="font-medium">
                          {student.username || "Unnamed"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewCourses(student)}
                        className="bg-[#3399CC] text-white px-2 lg:px-4 py-1 lg:py-2 text-sm rounded-full font-semibold shadow-lg cursor-pointer"
                      >
                        View Courses
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          student.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {student.status !== "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() => changeStatus(student, "ACTIVE")}
                            >
                              Change to Active
                            </DropdownMenuItem>
                          )}
                          {student.status !== "BLOCKED" && (
                            <DropdownMenuItem
                              onClick={() => changeStatus(student, "BLOCKED")}
                            >
                              Change to Blocked
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(student)}
                          >
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Dialog
          open={deleteDialogOpen}
          onOpenChange={() => setDeleteDialogOpen(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Student</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to remove{" "}
              {selectedStudent?.username || "this student"}?
            </p>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Courses Modal */}
      <Dialog open={coursesModalOpen} onOpenChange={setCoursesModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Courses</DialogTitle>
          </DialogHeader>

          {coursesLoading ? (
            <div className="text-center py-6">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </div>
          ) : studentCourses.length === 0 ? (
            <p>No courses assigned.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto mt-2">
              {studentCourses.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm"
                >
                  <span>{item.course.title}</span>
                  <Badge>{item.course.category.name}</Badge>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setCoursesModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
