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

const chartConfig = {
  students: { label: "Students", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export default function DashboardHome() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [totals, setTotals] = useState({ totalCourses: 0, totalStudents: 0, totalTutors: 0 });
  const [performanceData, setPerformanceData] = useState<{ month: string; count: number }[]>([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const dashboardRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/dashboard`, config);
      setTotals({
        totalCourses: dashboardRes.data.data.totalCourses,
        totalStudents: dashboardRes.data.data.totalStudents,
        totalTutors: dashboardRes.data.data.totalTutors,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard info:", err);
    }
  };

  const fetchPerformanceData = async (year: string) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/performance?search=${year}`,
        config
      );

      const monthsMap = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      setPerformanceData(
        res.data.data.map((item: any) => ({
          month: monthsMap[parseInt(item.month) - 1],
          count: item.count,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch performance data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPerformanceData(selectedYear);
  }, [selectedYear]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[28px] font-medium text-[#4D5154]">Total Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">{totals.totalCourses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[28px] font-medium text-[#4D5154]">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">{totals.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[28px] font-medium text-[#4D5154]">Total Tutors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">{totals.totalTutors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Performance</CardTitle>
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
            <ChartContainer config={chartConfig} className="h-[80%] w-full">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis hide />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `${value} ${selectedYear}`}
                      formatter={(value) => [value, chartConfig.students.label]}
                    />
                  }
                />
                <Area type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} fill="url(#fillArea)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
