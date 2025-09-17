"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import axios from "axios";
import AddAdminModal from "@/components/ui/modals/AddAdminModal";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const chartConfig = {
  students: { label: "Students", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

interface PerformanceItem {
  month: string | number;
  count: number;
}

type Admin = {
  id: string;
  username?: string;
  email: string;
  phone?: string;
  profileImage?: string;
  status: "ACTIVE" | "BLOCKED" | string;
};

export default function DashboardHome() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [totals, setTotals] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalTutors: 0,
  });
  const [performanceData, setPerformanceData] = useState<PerformanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Fetch Dashboard totals
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const dashboardRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/dashboard`,
        config
      );
      setTotals({
        totalCourses: dashboardRes.data.data.totalCourses,
        totalStudents: dashboardRes.data.data.totalStudents,
        totalTutors: dashboardRes.data.data.totalTutors,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard info:", err);
    }
  };

  // Fetch Admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-users?filter=ADMIN`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(res?.data?.data?.data || []);
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  // Add Admin
  const handleAddAdmin = async (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/add-student`,
        { ...data, role: "ADMIN" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(<span data-translate>Admin added successfully!</span>);
        fetchAdmins();
      } else {
        toast.error(res.data.message || "Failed to add Admin");
      }
    } catch {
      toast.error("Failed to add Admin");
    }
  };

  // Delete Admin
  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/remove-student/${selectedAdmin.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Admin removed successfully!");
      fetchAdmins();
    } catch {
      toast.error("Failed to remove admin");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setSelectedAdmin(null);
    }
  };

  // Fetch performance chart data
  const fetchPerformanceData = async (year: string) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/performance?search=${year}`,
        config
      );

      const monthsMap = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      setPerformanceData(
        (res.data.data as PerformanceItem[]).map((item) => ({
          month: monthsMap[Number(item.month) - 1] || "Unknown",
          count: Number(item.count) || 0,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch performance data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAdmins();
    fetchPerformanceData(selectedYear);
  }, [selectedYear]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8 mb-5">
        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle
                className="text-[28px] font-medium text-[#4D5154]"
                data-translate
              >
                Total Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">
                {totals.totalCourses}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle
                className="text-[28px] font-medium text-[#4D5154]"
                data-translate
              >
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">
                {totals.totalStudents}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle
                className="text-[28px] font-medium text-[#4D5154]"
                data-translate
              >
                Total Tutors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">
                {totals.totalTutors}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-xl font-semibold text-gray-900"
                data-translate
              >
                Performance
              </CardTitle>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-96 w-full">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis hide />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `${value} ${selectedYear}`}
                      formatter={(value) => [value, chartConfig.students.label]}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="url(#fillArea)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Admins Section */}
      <div className="max-w-7xl flex flex-col items-start justify-end mx-auto mt-6 space-y-4">
        <div className="max-w-7xl w-full mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" data-translate>
              Admins
            </h2>
            {/* Add Admin Modal on the right */}
            <AddAdminModal onAdd={handleAddAdmin} />
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border-b">#</th>
                  <th className="px-4 py-2 text-left border-b">Name</th>
                  <th className="px-4 py-2 text-left border-b">Email</th>
                  <th className="px-4 py-2 text-left border-b">Status</th>
                  <th className="px-4 py-2 text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading admins...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  admins.map((admin, index) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{index + 1}</td>
                      <td className="px-4 py-2 border-b">
                        {admin.username || "Unnamed"}
                      </td>
                      <td className="px-4 py-2 border-b">{admin.email}</td>
                      <td className="px-4 py-2 border-b">{admin.status}</td>
                      <td className="px-4 py-2 border-b">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(admin)}
                          className="cursor-pointer"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Dialog
          open={deleteDialogOpen}
          onOpenChange={() => setDeleteDialogOpen(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Admin</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to remove{" "}
              {selectedAdmin?.username || "this admin"}?
            </p>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Removing..." : "Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
