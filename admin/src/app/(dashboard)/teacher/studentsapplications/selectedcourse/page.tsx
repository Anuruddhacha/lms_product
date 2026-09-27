"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Check, X } from "lucide-react";
import {
  useGetAllCourseRequestsQuery,
  useEnrollUserInCourseMutation,
  useUnenrollUserFromCourseMutation,
  useAcceptRegistrationCodeMutation,
  useSaveCourseRequestMutation,
  useGetUserEnrolledCoursesQuery,
} from "@/state/api";
import CourseCheckboxCard from "@/components/CourseCheckboxCard";
import Loading from "@/components/Loading";
import { getSafeImageUrl } from "@/lib/utils";

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

  const safeProfileImageUrl = getSafeImageUrl(profileImageUrl, "");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => router.push("/teacher/studentsapplications")}
        className="flex items-center gap-2 text-udemy-gray hover:text-udemy-black transition-colors mb-5 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </button>

      {/* Student summary card */}
      <div className="bg-white-100 border border-gray-200 rounded-md p-5 shadow-sm flex items-center gap-4 mb-6">
        {safeProfileImageUrl ? (
          <Image
            src={safeProfileImageUrl}
            alt={`${request.userName}'s profile`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border border-gray-200 object-cover shrink-0"
            unoptimized={safeProfileImageUrl.startsWith("http://") || safeProfileImageUrl.startsWith("https://")}
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-udemy-purpleLight text-udemy-purple font-bold text-lg">
            {request.userName?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-udemy-black truncate">{request.userName}</h2>
          <p className="text-sm text-udemy-gray">Reg.No: {code}</p>
        </div>
        <span
          className={`ml-auto shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
            request.isAccepted
              ? "bg-udemy-purpleLight text-udemy-purple"
              : "bg-gray-100 text-udemy-gray"
          }`}
        >
          {request.isAccepted ? "Accepted" : "Pending"}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
        <div className="bg-white-100 border border-gray-200 rounded-md p-4">
          <p className="text-udemy-gray mb-1">Email</p>
          <p className="text-udemy-black font-medium">{request.email}</p>
        </div>
        <div className="bg-white-100 border border-gray-200 rounded-md p-4">
          <p className="text-udemy-gray mb-1">Phone</p>
          <p className="text-udemy-black font-medium">{request.phone}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-udemy-black mb-3">Requested Courses</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
          className="inline-flex items-center gap-2 bg-udemy-purple hover:bg-udemy-purpleDark text-white-100 font-bold px-5 py-2.5 rounded-sm transition-colors"
        >
          <Check className="w-4 h-4" />
          Grant Access
        </button>
        <button
          onClick={handleBlockAccess}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white-100 font-bold px-5 py-2.5 rounded-sm transition-colors"
        >
          <X className="w-4 h-4" />
          Block Access
        </button>
      </div>
    </div>
  );
};

export default SelectCoursesPage;
