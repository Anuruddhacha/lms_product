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
  useEnrollUserInAllSpecialCategoryCoursesMutation,
} from "@/state/api";
import CourseCheckboxCard from "@/components/CourseCheckboxCard";
import Loading from "@/components/Loading";

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
  const [enrollUserInAllSpecialCategoryCourses] = useEnrollUserInAllSpecialCategoryCoursesMutation();


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

      if(!request.isAccepted){
       // Enroll user in all special category courses instead of selected ones - if not already accepted
       await enrollUserInAllSpecialCategoryCourses({ userId }).unwrap();
      }

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
      <h2 className="text-2xl font-semibold text-white mb-4">All Course Requests</h2>
      <p className="text-muted-foreground mb-2">Total Requests: {requests.length}</p>


  <div className="mb-4">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by name, phone, or reg. number"
    className="w-full sm:w-80 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 placeholder-gray-400"
  />
</div>


      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2">
        {["all", "pending", "accepted"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-1 rounded ${
              filterStatus === status ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
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
            className="bg-customgreys-secondarybg rounded-lg p-4 shadow-md flex flex-col justify-between"
          >

              {request.profileImageUrl && (
                <Image
                  src={request.profileImageUrl}
                  alt={`${request.userName}'s profile`}
                  width={80}
                  height={80}
                  className="mb-2 h-20 w-20 rounded-full border object-cover"
                  unoptimized={
                    request.profileImageUrl.startsWith("http://") ||
                    request.profileImageUrl.startsWith("https://")
                  }
                />
              )} 
            <div>
              <p className="text-white text-sm mb-1">
                <span className="font-semibold">Reg.No:</span> {request.code}
              </p>

              <p className="text-white text-sm mb-1">
                <span className="font-semibold">Name:</span> {request.userName}
              </p>
              <p className="text-white text-sm mb-1">
                <span className="font-semibold">Email:</span> {request.email}
              </p>
              <p className="text-white text-sm mb-1">
                <span className="font-semibold">Phone:</span> {request.phone}
              </p>
              <p className="text-white text-sm mb-3">
                <span className="font-semibold">Status:</span>{" "}
                {request.isAccepted ? "✅ Accepted" : "⏳ Pending"}
              </p>

              {/*<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {(request.selectedCourseIds || []).slice(0, 6).map((courseId: string) => (
                  <CourseCheckboxCard
                    key={courseId}
                    courseId={courseId}
                    selectedCourses={selectedCourses[request.code] || []}
                    onToggle={(id) => toggleCourseSelection(request.code, id)}
                    userId={request.userId}
                  />

                ))}
              </div>*/}
<div className="mb-3">
  <a
    href={`/teacher/studentsapplications/selectedcourse?userId=${request.userId}&code=${request.code}&profileImageUrl=${encodeURIComponent(request.profileImageUrl || '')}`}
    className="inline-block font-bold text-black bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded text-sm"
  >
    Review Application
  </a>
</div>


            </div>

           { /*<div className="flex gap-2 mt-2">
            <button
             onClick={() => enrollCourse(request.userId, request.code, request.profileImageUrl)}
             className="bg-blue-600 hover:bg-blue-500 text-white w-full py-2 rounded flex-1"
             >
              Grant Access
            </button>
           <button
             onClick={() => unenrollCourse(request.userId, request.code)}
           className="bg-red-600 hover:bg-red-500 text-white w-full py-2 rounded flex-1"
              >
               Block Access
              </button>
              </div>*/}

          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourseRequests;
