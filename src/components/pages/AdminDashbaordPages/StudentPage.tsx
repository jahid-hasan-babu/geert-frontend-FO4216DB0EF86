"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "next/image";

type Student = {
  id: string;
  username?: string;
  email: string;
  phone?: string;
  profileImage?: string;
  status: "ACTIVE" | "BLOCKED" | string;
};

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const studentsPerPage = 15;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-users?filter=STUDENT`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(res.data.data.data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const changeStatus = async (student: Student, status: "ACTIVE" | "BLOCKED") => {
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
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto">
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
          <AddStudentModal onAddSuccess={fetchStudents} />
        </div>

        <div className="bg-white rounded-lg border mb-3 lg:mb-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Serial No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{formatSerialNo(index)}</TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {student.profileImage ? (
                          <Image
                            src={student.profileImage}
                            alt="avatar"
                            width={20}
                            height={20}
                            className="rounded-full object-cover bg-blue-500"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-medium">
                            {(student.username || student.email).charAt(0)}
                          </div>
                        )}
                        <span className="font-medium">{student.username || "Unnamed"}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-600">{student.email}</TableCell>
                    <TableCell className="text-gray-600">{student.phone || "—"}</TableCell>

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
                            className="w-8 h-8 cursor-pointer"
                            title="Change Status"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {student.status !== "ACTIVE" && (
                            <DropdownMenuItem onClick={() => changeStatus(student, "ACTIVE")}>
                              Change to Active
                            </DropdownMenuItem>
                          )}
                          {student.status !== "BLOCKED" && (
                            <DropdownMenuItem onClick={() => changeStatus(student, "BLOCKED")}>
                              Change to Blocked
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
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
    </div>
  );
}
