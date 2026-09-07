"use client";

import React from "react";
import { useGetCourseQuery, useGetUserEnrolledCoursesQuery } from "@/state/api";
import CourseCardSearch from "@/components/CourseCardSearch";

interface Props {
  courseId: string;
  selectedCourses: string[];
  onToggle: (id: string) => void;
  userId: string;
  enrolledCourses: any[]; // Add this line
}


const CourseCheckboxCard = ({
  courseId,
  selectedCourses,
  onToggle,
  userId,
  enrolledCourses, // ← use this
}: Props) => {
  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useGetCourseQuery(courseId);

  if (isCourseLoading) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  if (courseError || !course) {
    return <div className="text-sm text-red-500">Failed to load course info</div>;
  }

  const isAlreadyEnrolled = enrolledCourses?.some((c: any) => c.courseId === courseId);

  return (
    <label className="flex gap-2 items-start bg-customgreys-primarybg p-2 rounded">
      <input
        type="checkbox"
        checked={selectedCourses.includes(courseId)}
        onChange={() => onToggle(courseId)}
      />
      <div className="flex-1">
        <CourseCardSearch course={course} />
        {isAlreadyEnrolled && (
          <p className="text-xs text-green-400 mt-1">✅ Already Enrolled</p>
        )}
      </div>
    </label>
  );
};

export default CourseCheckboxCard;
