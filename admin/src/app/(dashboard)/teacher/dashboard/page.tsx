"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetDashboardStatsQuery } from "@/state/api";
import { Users, BookOpen, GraduationCap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#f472b6", "#fb923c", "#a78bfa", "#38bdf8", "#facc15", "#34d399"];

const DashboardPage = () => {
  const { data: stats, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) return <Loading />;

  if (isError || !stats) {
    return (
      <div className="p-8 text-center text-gray-500">
        Failed to load dashboard stats.
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" subtitle="An overview of your courses and students" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-rose-100 rounded-2xl p-6 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-rose-200 flex items-center justify-center text-rose-700">
            <Users size={22} />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">
            {stats.totalStudents.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Students</p>
        </div>

        <div className="bg-violet-100 rounded-2xl p-6 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-violet-200 flex items-center justify-center text-violet-700">
            <BookOpen size={22} />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">
            {stats.totalCourses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Courses</p>
        </div>

        <div className="bg-amber-100 rounded-2xl p-6 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-amber-200 flex items-center justify-center text-amber-700">
            <GraduationCap size={22} />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">
            {stats.totalEnrollments.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Enrollments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Enrollment Trends */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Enrollment Trends
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #fce7f3" }}
                cursor={{ fill: "#fdf2f8" }}
              />
              <Bar dataKey="enrollments" fill="#f472b6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Courses by Category
          </h2>
          {stats.categoryBreakdown.length === 0 ? (
            <p className="text-sm text-gray-500">No courses yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={stats.categoryBreakdown}
                    dataKey="count"
                    nameKey="category"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {stats.categoryBreakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
                {stats.categoryBreakdown.map((c, i) => (
                  <div
                    key={c.category}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-gray-600">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      {c.category}
                    </span>
                    <span className="font-medium text-gray-900">{c.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Courses */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Courses
          </h2>
          {stats.recentCourses.length === 0 ? (
            <p className="text-sm text-gray-500">No courses created yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.recentCourses.map((c) => (
                <div
                  key={c.courseId}
                  className="rounded-xl overflow-hidden border border-gray-100"
                >
                  <div className="relative w-full h-24 bg-rose-50">
                    <Image
                      src={c.image || "/placeholderex.png"}
                      alt={c.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {c.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Courses</h2>
          {stats.topCourses.length === 0 ? (
            <p className="text-sm text-gray-500">No enrollments yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.topCourses.map((c, i) => (
                <div key={c.courseId} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {c.title}
                    </p>
                    <p className="text-xs text-gray-500">{c.enrollments} enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
