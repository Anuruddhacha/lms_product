"use client";

import {
  useListAllCoursesQuery,
  useGetUserByIdQuery,
  useRegisterAnotherCodeForExistingUserMutation,
  useSaveCourseRequestMutation,
} from "@/state/api";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import CourseCardSearch from "@/components/CourseCardSearch";
import { useUser } from "@clerk/nextjs";

const CourseRequestByCode = () => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [registrationCodeInput, setRegistrationCodeInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user } = useUser();

  const [registrationCode, setRegistrationCode] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");

  const searchParams = useSearchParams();
  const queryParamCode = searchParams.get("registrationCode");
  const initialCode = queryParamCode || "";

  const { data: courses, isLoading: loadingCourses, isError } = useListAllCoursesQuery();
  const [saveCourseRequest] = useSaveCourseRequestMutation();
  const [registerAnotherCodeForExistingUser] = useRegisterAnotherCodeForExistingUserMutation();

  const userId = user?.id;
  const userEmail = user?.emailAddresses[0]?.emailAddress;


  const { data: userData, isLoading: loadingUser } = useGetUserByIdQuery(userId!, {
  skip: !userId,
  });

  const handleCheckboxChange = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userData) {
    setError("User data not found.");
    return;
    }

   

    const code = registrationCodeInput.trim() || initialCode;

    if (!code) {
      setError("Registration code is required.");
      return;
    }

    if (selectedCourses.length === 0) {
      setError("Please select at least one course.");
      return;
    }

    setSubmitting(true);
    try {

    const response = await registerAnotherCodeForExistingUser({ code: code, email: userEmail! }).unwrap();

    if (response.success) {

      const result = await saveCourseRequest({
      code: code,
      isAccepted: false,
      userId: userId!,
      email: userData.email,
      userName: userData.name,
      phone: userData.phone,
      selectedCourseIds: selectedCourses,
      profileImageUrl: userData.profileImage || "",
    }).unwrap();

      if (!result.success) {
        setError("Failed to save course request.");
        return;
      }

      setSuccess("Your course request has been submitted!");
      setSelectedCourses([]);
      setRegistrationCodeInput("");
      
    } else if (response.alreadyExists) {
      setError("Registration number or email already exists.");
      return;
    }

    
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  

 if (!loadingUser && !userData) {


  const handleRedirect = () => {
    if (!registrationCode.trim() || !registrationEmail.trim()) return;
    window.location.href = `/registration?registrationCode=${encodeURIComponent(registrationCode)}&registrationEmail=${encodeURIComponent(registrationEmail)}`;
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="max-w-md w-full bg-customgreys-secondarybg p-6 rounded-lg shadow text-center">
        <p className="text-white mb-4">We couldn’t find your profile data.</p>

        {/* Registration Code Input */}
        <input
          type="text"
          placeholder="Enter Registration Code"
          value={registrationCode}
          onChange={(e) => setRegistrationCode(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-slate-900 dark:bg-slate-800 text-white"
        />

        {/* Registration Email Input */}
        <input
          type="email"
          placeholder="Enter Email"
          value={registrationEmail}
          onChange={(e) => setRegistrationEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-slate-900 dark:bg-slate-800 text-white"
        />

        <button
          onClick={handleRedirect}
          className="bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded w-full"
          disabled={!registrationCode || !registrationEmail}
        >
          Please Complete Registration
        </button>
      </div>
    </div>
  );
}



  return (
    <div className="flex justify-center items-center py-10 px-4 bg-blue-50">
  <form
    onSubmit={handleSubmit}
    className="max-w-2xl w-full bg-white p-8 rounded-md shadow-md"
  >
    <h2 className="text-blue-900 text-xl font-semibold mb-6">Request More Courses</h2>

    {/* Registration Code Input */}
    <input
      type="text"
      placeholder="Enter your Registration Code"
      value={registrationCodeInput}
      onChange={(e) => setRegistrationCodeInput(e.target.value)}
      className="w-full p-3 mb-6 rounded border border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 text-black bg-blue-50 placeholder-blue-700"
    />

    {/* Course List */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
  {loadingCourses ? (
    <p className="text-blue-700">Loading courses...</p>
  ) : isError ? (
    <p className="text-red-600">Failed to load courses.</p>
  ) : (
    courses
      ?.map((course) => (
        <label
          key={course.courseId}
          className="flex gap-2 items-start bg-blue-100 p-3 rounded border border-blue-300"
        >
          <input
            type="checkbox"
            checked={selectedCourses.includes(course.courseId)}
            onChange={() => handleCheckboxChange(course.courseId)}
            className="mt-1 accent-blue-600"
          />
          <div className="flex-1">
            <CourseCardSearch course={course} />
          </div>
        </label>
      ))
  )}
</div>


    {/* Feedback */}
    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
    {success && <p className="text-blue-600 text-sm mb-2">{success}</p>}

    {/* Submit Button */}
    <button
      type="submit"
      disabled={submitting}
      className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-md w-full transition duration-200 disabled:opacity-60"
    >
      {submitting ? "Submitting..." : "Request Courses"}
    </button>
  </form>
</div>

  );
};

export default CourseRequestByCode;
