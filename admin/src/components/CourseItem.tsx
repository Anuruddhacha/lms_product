// components/CourseItem.tsx
"use client";

import { useGetCourseQuery } from "@/state/api";
import CourseCardSearch from "@/components/CourseCardSearch";

interface Props {
  courseId: string;
}

const CourseItem = ({ courseId }: Props) => {
  const { data: course, isLoading, error } = useGetCourseQuery(courseId);

  if (isLoading) return <div>Loading...</div>;
  if (error || !course) return <div>Course not found</div>;

  return (
    <label className="flex gap-2 items-start bg-customgreys-primarybg p-2 rounded">
      <input type="checkbox" checked disabled className="mt-1" />
      <div className="flex-1">
        <CourseCardSearch course={course} />
      </div>
    </label>
  );
};

export default CourseItem;
