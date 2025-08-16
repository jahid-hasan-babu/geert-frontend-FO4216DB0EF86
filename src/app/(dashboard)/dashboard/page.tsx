"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "Jan", courses: 45, students: 320 },
  { month: "Feb", courses: 78, students: 450 },
  { month: "Mar", courses: 35, students: 280 },
  { month: "Apr", courses: 42, students: 350 },
  { month: "May", courses: 58, students: 420 },
  { month: "Jun", courses: 65, students: 480 },
  { month: "Jul", courses: 20, students: 500 },
  { month: "Aug", courses: 85, students: 520 },
  { month: "Sep", courses: 45, students: 380 },
  { month: "Oct", courses: 38, students: 340 },
  { month: "Nov", courses: 32, students: 300 },
  { month: "Dec", courses: 28, students: 280 },
]

const chartConfig = {
  courses: {
    label: "Course",
    color: "hsl(var(--chart-1))",
  },
  students: {
    label: "Student",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState("2025")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[30]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[28px] font-medium text-[#4D5154]">Total Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">200</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[28px] font-medium text-[#4D5154]">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">5000</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[28px] font-medium text-[#4D5154]">Total Tutors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-medium text-gray-900">20</div>
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
              <AreaChart data={chartData}>
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
                      formatter={(value, name) => [value, chartConfig[name as keyof typeof chartConfig]?.label || name]}
                    />
                  }
                />
                <Area type="monotone" dataKey="students" stroke="#0ea5e9" strokeWidth={2} fill="url(#fillArea)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
