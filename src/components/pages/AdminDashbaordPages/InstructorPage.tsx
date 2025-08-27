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
import AddInstructorModal from "@/components/ui/modals/AddInstructorModal";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface Instructor {
  id: string;
  username: string | null;
  email: string;
  profileImage: string | null;
  role: "INSTRUCTOR";
  phone: string | null;
  status: "ACTIVE" | "INACTIVE";
  designation: string | null;
}

export default function InstructorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);

  const instructorsPerPage = 15;

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/all-users?filter=INSTRUCTOR`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInstructors(res.data.data.data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load instructors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Filter + pagination
  const filteredInstructors = instructors.filter(
    (instructor) =>
      (instructor.username || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);
  const startIndex = (currentPage - 1) * instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(
    startIndex,
    startIndex + instructorsPerPage
  );

  const formatSerialNo = (index: number) =>
    String(startIndex + index + 1).padStart(2, "0");

  // Handle add instructor
  const handleAddInstructor = async (data: {
    username: string;
    email: string;
    designation: string;
    image: File | null;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append(
        "bodyData",
        JSON.stringify({
          username: data.username,
          email: data.email,
          designation: data.designation,
        })
      );
      if (data.image) formData.append("profileImage", data.image);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/add-instructor`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Instructor added successfully!");
        fetchInstructors();
      } else {
        toast.error(res.data.message || "Failed to add instructor");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add instructor");
    }
  };

  const handleStatusChange = async (instructorId: string, status: "ACTIVE" | "INACTIVE") => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update-status/${instructorId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status changed to ${status}`);
      fetchInstructors();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change status");
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
          <AddInstructorModal onAdd={handleAddInstructor} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border mb-3 lg:mb-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Serial No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    Loading instructors...
                  </TableCell>
                </TableRow>
              ) : currentInstructors.length > 0 ? (
                currentInstructors.map((instructor, index) => (
                  <TableRow key={instructor.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {formatSerialNo(index)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium">
                          {instructor?.profileImage ? (
                            <Image
                              src={instructor.profileImage}
                              alt={instructor.username || "Instructor"}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-sky-600 font-medium">
                              {(instructor.username || "U").charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="font-medium">
                          {instructor.username || "Unnamed"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {instructor.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {instructor.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/instructor/${instructor?.id}`}>
                        <button className="bg-[#3399CC] text-white px-2 lg:px-4 py-1 lg:py-2 text-sm rounded-full font-semibold shadow-lg cursor-pointer">
                          View Courses
                        </button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          instructor.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {instructor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 cursor-pointer">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {instructor.status !== "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(instructor.id, "ACTIVE")
                              }
                            >
                              Change to activate
                            </DropdownMenuItem>
                          )}
                          {instructor.status !== "INACTIVE" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(instructor.id, "INACTIVE")
                              }
                            >
                              Change to block
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No instructors found
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
