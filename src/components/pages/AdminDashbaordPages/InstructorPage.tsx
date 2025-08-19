"use client";

import { useState } from "react";
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
import { instructorsData } from "@/utils/dummyData";
import AddInstructorModal from "@/components/ui/modals/AddInstructorModal";
import Link from "next/link";

export default function InstructorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 15;

  const filteredInstructors = instructorsData.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleAddInstructor = (instructor: {
    name: string;
    email: string;
    designation: string;
    image: File | null;
  }) => {
    console.log("✅ New Instructor added:", instructor);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
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

          {/* Add Instructor Button + Modal */}
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
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInstructors.length > 0 ? (
                currentInstructors.map((instructor, index) => (
                  <TableRow key={instructor.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {formatSerialNo(index)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-medium">
                          {instructor.name.charAt(0)}
                        </div>
                        <span className="font-medium">{instructor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {instructor.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {instructor.phone}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          instructor.status === "Active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {instructor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/instructor/${instructor?.id}`}>
                        <button className="bg-[#3399CC] text-white px-2 lg:px-4 py-1 lg:py-2 text-sm rounded-full font-semibold shadow-lg cursor-pointer">
                          View Courses
                        </button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
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
