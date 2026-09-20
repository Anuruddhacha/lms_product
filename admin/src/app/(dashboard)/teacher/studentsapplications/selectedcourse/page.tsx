"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetAllCourseRequestsQuery,
  useEnrollUserInCourseMutation,
  useUnenrollUserFromCourseMutation,
  useAcceptRegistrationCodeMutation,
  useSaveCourseRequestMutation,
  useEnrollUserInAllSpecialCategoryCoursesMutation,
  useGetUserEnrolledCoursesQuery,
} from "@/state/api";
import CourseCheckboxCard from "@/components/CourseCheckboxCard";
import Loading from "@/components/Loading";

const SelectCoursesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId")!;
  const code = searchParams.get("code")!;
  const profileImageUrl = searchParams.get("profileImageUrl") || "";

  const { data: courseRequestsData, isLoading } = useGetAllCourseRequestsQuery();
  const { data: enrolledCourses = [], isLoading: isEnrolledLoading } = useGetUserEnrolledCoursesQuery(userId, {
    skip: !userId,
  });

  const request = courseRequestsData?.data?.find((r: any) => r.code === code);

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [enrollUserInCourse] = useEnrollUserInCourseMutation();
  const [unenrollUserFromCourse] = useUnenrollUserFromCourseMutation();
  const [acceptRegistrationCode] = useAcceptRegistrationCodeMutation();
  const [saveCourseRequest] = useSaveCourseRequestMutation();
  const [enrollUserInAllSpecialCategoryCourses] = useEnrollUserInAllSpecialCategoryCoursesMutation();

  useEffect(() => {
    if (request?.selectedCourseIds) {
      setSelectedCourses(request.selectedCourseIds);
    }
  }, [request]);

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleGrantAccess = async () => {
    if (!request) return;

    try {
      if (!request.isAccepted) {
        await acceptRegistrationCode({ code: request.code }).unwrap();

        await saveCourseRequest({
          code: request.code,
          isAccepted: true,
          userId: request.userId,
          email: request.email,
          userName: request.userName,
          phone: request.phone,
          selectedCourseIds: selectedCourses,
          profileImageUrl,
        }).unwrap();

        await enrollUserInAllSpecialCategoryCourses({ userId }).unwrap();
      }

      await Promise.all(
        selectedCourses.map((courseId) =>
          enrollUserInCourse({ userId, courseId }).unwrap()
        )
      );

      alert("User enrolled and request accepted.");
      router.push("/teacher/studentsapplications");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const handleBlockAccess = async () => {
    try {
      await Promise.all(
        selectedCourses.map((courseId) =>
          unenrollUserFromCourse({ userId, courseId }).unwrap()
        )
      );
      alert("User unenrolled from selected courses.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while unenrolling!");
    }
  };

  if (isLoading || !request || isEnrolledLoading) return <Loading />;

  return (
    <div className="p-6 text-gray-900">
      <h2 className="text-2xl font-semibold mb-2">Select Courses for Reg.No: {code}</h2>

      <div className="mb-4 text-sm text-gray-500">
        <p><strong>Name:</strong> {request.userName}</p>
        <p><strong>Email:</strong> {request.email}</p>
        <p><strong>Phone:</strong> {request.phone}</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {(request.selectedCourseIds || []).map((courseId: string) => (
          <CourseCheckboxCard
            key={courseId}
            courseId={courseId}
            selectedCourses={selectedCourses}
            onToggle={toggleCourseSelection}
            userId={userId}
            enrolledCourses={enrolledCourses} // ✅ passed here
          />
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleGrantAccess}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          ✅ Grant Access
        </button>
        <button
          onClick={handleBlockAccess}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
        >
          ❌ Block Access
        </button>
      </div>
    </div>
  );
};

export default SelectCoursesPage;
