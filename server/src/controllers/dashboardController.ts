import { Request, Response } from "express";
import Course from "../models/courseModel";
import DBUser from "../models/userModel";
import UserCourseProgress from "../models/userCourseProgressModel";

export const getDashboardStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [courses, students, progressRecords] = await Promise.all([
      Course.scan().exec(),
      DBUser.scan().exec(),
      UserCourseProgress.scan().exec(),
    ]);

    const totalCourses = courses.length;
    const totalStudents = students.length;
    const totalEnrollments = (courses as any[]).reduce(
      (sum, c) => sum + (c.enrollments?.length || 0),
      0
    );

    // Enrollment trends for the last 6 months
    const now = new Date();
    const months: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("en-US", { month: "short" }),
      });
    }
    const trendMap = new Map(months.map((m) => [m.key, 0]));
    for (const p of progressRecords as any[]) {
      const d = new Date(p.enrollmentDate);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (trendMap.has(key)) {
        trendMap.set(key, (trendMap.get(key) || 0) + 1);
      }
    }
    const enrollmentTrends = months.map((m) => ({
      month: m.label,
      enrollments: trendMap.get(m.key) || 0,
    }));

    // Course count per category
    const categoryMap = new Map<string, number>();
    for (const c of courses as any[]) {
      const cat = c.category || "Uncategorized";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    }
    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, count]) => ({ category, count })
    );

    // Top courses by enrollment count
    const topCourses = [...(courses as any[])]
      .sort((a, b) => (b.enrollments?.length || 0) - (a.enrollments?.length || 0))
      .slice(0, 5)
      .map((c) => ({
        courseId: c.courseId,
        title: c.title,
        image: c.image,
        category: c.category,
        enrollments: c.enrollments?.length || 0,
      }));

    // Most recently created courses
    const recentCourses = [...(courses as any[])]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 4)
      .map((c) => ({
        courseId: c.courseId,
        title: c.title,
        image: c.image,
        category: c.category,
        price: c.price,
      }));

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      data: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        enrollmentTrends,
        categoryBreakdown,
        topCourses,
        recentCourses,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
