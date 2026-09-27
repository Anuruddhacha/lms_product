"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  useEnrollUserInCourseMutation,
  useGetAllCourseRequestsQuery,
  useSaveCourseRequestMutation,
  useAcceptRegistrationCodeMutation,
  useUnenrollUserFromCourseMutation,
} from "@/state/api";
import CourseCheckboxCard from "@/components/CourseCheckboxCard";
import Loading from "@/components/Loading";
import { getSafeImageUrl } from "@/lib/utils";

const AllCourseRequests = () => {
  const { user, isLoaded } = useUser();
  const { data, isLoading: isLoadingRequests } = useGetAllCourseRequestsQuery(undefined, {
    skip: !isLoaded || !user,
  });

  const [enrollUserInCourse] = useEnrollUserInCourseMutation();
  const [unenrollUserFromCourse] = useUnenrollUserFromCourseMutation();
  const [selectedCourses, setSelectedCourses] = useState<{ [key: string]: string[] }>({});
  const [saveCourseRequest] = useSaveCourseRequestMutation();
  const [acceptRegistrationCode] = useAcceptRegistrationCodeMutation();


  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted">("all");
  const [searchTerm, setSearchTerm] = useState("");

  

  const requests = data?.data || [];

  /*const filteredRequests = requests.filter((request: any) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "accepted") return request.isAccepted === true;
    if (filterStatus === "pending") return request.isAccepted !== true;
    return true;
  });*/


  const filteredRequests = requests.filter((request: any) => {
  // First, filter by status
  const matchesStatus =
    filterStatus === "all" ||
    (filterStatus === "accepted" && request.isAccepted === true) ||
    (filterStatus === "pending" && request.isAccepted !== true);

  // Then, filter by search term (case-insensitive)
  const lowerSearch = searchTerm.toLowerCase().trim();
  const matchesSearch =
    !lowerSearch ||
    request.userName?.toLowerCase().includes(lowerSearch) ||
    request.phone?.toLowerCase().includes(lowerSearch) ||
    request.code?.toLowerCase().includes(lowerSearch);

  return matchesStatus && matchesSearch;
});


  const toggleCourseSelection = (requestCode: string, courseId: string) => {
    setSelectedCourses((prev) => {
      const selected = prev[requestCode] || [];
      return {
        ...prev,
        [requestCode]: selected.includes(courseId)
          ? selected.filter((id) => id !== courseId)
          : [...selected, courseId],
      };
    });
  };

  const enrollCourse = async (userId: string, requestCode: string, profileImageUrl: string) => {
    const selected = selectedCourses[requestCode] || [];
    const request = requests.find((r: any) => r.code === requestCode);
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
          selectedCourseIds: request.selectedCourseIds,
          profileImageUrl
        }).unwrap();
      }

      await Promise.all(
        selected.map((courseId) =>
          enrollUserInCourse({ userId, courseId }).unwrap()
        )
      );

      console.log(`Enrollment and request update successful for ${userId}`);
    } catch (err) {
      console.error("Enrollment or request update failed:", err);
    }
  };


  const unenrollCourse = async (userId: string, requestCode: string) => {
  const selected = selectedCourses[requestCode] || [];
  if (!selected.length) return;

  try {
    await Promise.all(
      selected.map((courseId) =>
        unenrollUserFromCourse({ userId, courseId }).unwrap()
      )
    );
    console.log(`Unenrollment successful for ${userId}`);
  } catch (err) {
    //console.error("Unenrollment failed:", err);
  }
};


  if (!isLoaded || isLoadingRequests) return <Loading />;
  if (!user) return <div>Please sign in to view course requests.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Course Requests</h2>
      <p className="text-muted-foreground mb-2">Total Requests: {requests.length}</p>


  <div className="mb-4">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by name, phone, or reg. number"
    className="w-full sm:w-80 px-3 py-2 rounded bg-white-100 text-gray-900 border border-customgreys-darkerGrey placeholder-gray-400"
  />
</div>


      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2">
        {["all", "pending", "accepted"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-1 rounded ${
              filterStatus === status ? "bg-udemy-purple text-white-100" : "bg-gray-100 text-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredRequests.map((request: any) => (
          <div
            key={request.code}
            className="bg-white-100 border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              {request.profileImageUrl && !request.profileImageUrl.startsWith("undefined/") ? (
                <Image
                  src={getSafeImageUrl(request.profileImageUrl)}
                  alt={`${request.userName}'s profile`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full border border-gray-200 object-cover shrink-0"
                  unoptimized={
                    request.profileImageUrl.startsWith("http://") ||
                    request.profileImageUrl.startsWith("https://")
                  }
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-udemy-purpleLight text-udemy-purple font-bold">
                  {request.userName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-udemy-black truncate">{request.userName}</p>
                <p className="text-xs text-udemy-gray">Reg.No: {request.code}</p>
              </div>
              <span
                className={`ml-auto shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                  request.isAccepted
                    ? "bg-udemy-purpleLight text-udemy-purple"
                    : "bg-gray-100 text-udemy-gray"
                }`}
              >
                {request.isAccepted ? "Accepted" : "Pending"}
              </span>
            </div>

            <div className="space-y-1.5 mb-4 text-sm">
              <p className="text-udemy-gray truncate">
                <span className="text-udemy-black font-medium">Email:</span> {request.email}
              </p>
              <p className="text-udemy-gray">
                <span className="text-udemy-black font-medium">Phone:</span> {request.phone}
              </p>
            </div>

            <a
              href={`/teacher/studentsapplications/selectedcourse?userId=${request.userId}&code=${request.code}&profileImageUrl=${encodeURIComponent(request.profileImageUrl || '')}`}
              className="mt-auto inline-flex items-center justify-center font-bold text-white-100 bg-udemy-purple hover:bg-udemy-purpleDark px-4 py-2 rounded-sm text-sm transition-colors"
            >
              Review Application
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourseRequests;
