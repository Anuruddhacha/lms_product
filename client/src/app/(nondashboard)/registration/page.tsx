"use client";

import {
  useListAllCoursesQuery,
  useGetUploadProfileImageUrlMutation,
  useRegisterUserAtomicMutation,
  useSaveCourseRequestMutation,
  useSaveRegistrationCodeIfNewMutation,
  useSaveUserMutation,
  useUpdatePasscodeStatusMutation,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import CourseCardSearch from "@/components/CourseCardSearch";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const router = useRouter();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const registerCode = searchParams.get("registrationCode");
  const registrationEmail = searchParams.get("registrationEmail");

  const [saveCourseRequest] = useSaveCourseRequestMutation();
  const { data: courses, isLoading: loadingCourses, isError } = useListAllCoursesQuery();
  const [getUploadProfileImageUrl] = useGetUploadProfileImageUrlMutation();
  const [saveRegistrationCodeIfNew] = useSaveRegistrationCodeIfNewMutation();
  const [updatePasscodeStatus] = useUpdatePasscodeStatusMutation();
  const [submitting, setSubmitting] = useState(false);
  const [registerUserAtomic, { isLoading }] = useRegisterUserAtomicMutation();


  const [saveUser] = useSaveUserMutation();

  const handleCheckboxChange = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageAndGetUrl = async (file: File): Promise<string> => {
  const { name: fileName, type: fileType } = file;

  try {
    const { uploadUrl, imageUrl } = await getUploadProfileImageUrl({ fileName, fileType }).unwrap();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": fileType },
      body: file,
    });

    return imageUrl;
  } catch (err) {
    console.error("Image upload failed", err);
    throw new Error("Failed to upload profile image.");
  }
};


  const handleSubmitEx = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true); // start loading state

    if (!name || !phone || !address || selectedCourses.length === 0) {
      setError("All fields and at least one course selection are required.");
      setSubmitting(false);
      return;
    }
    if (!user?.primaryEmailAddress?.emailAddress) {
  setError("Invalid email. Please use the correct one.");
  setSubmitting(false);
  return;
  }


    try {
      let uploadedImageUrl = "https://example.com/default-profile.png";
      if (profileImage) {
        uploadedImageUrl = await uploadImageAndGetUrl(profileImage);
      }

      const result = await saveCourseRequest({
        code: registerCode!,
        isAccepted: false,
        userId: user!.id,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        userName: name,
        phone,
        selectedCourseIds: selectedCourses,
        profileImageUrl: uploadedImageUrl,
      }).unwrap();

      if (!result.success) {
        setError("Failed to save course request.");
        setSubmitting(false);
        return;
      }

      //save registration number and email
        const registrationResponse = await saveRegistrationCodeIfNew({ code: registerCode!,
           email: user?.primaryEmailAddress?.emailAddress,
            isSavingRequest:true }).unwrap();
        if (!registrationResponse.success) {
        setError("Failed to register the code.");
        setSubmitting(false);
        return;
      }


      // === New part: Update passcode status using sessionStorage ===
const storedPasscode = sessionStorage.getItem("passcode");
console.log("Stored passcode:", storedPasscode);
if (storedPasscode) {
  try {
    await updatePasscodeStatus({ passcode: storedPasscode }).unwrap();
    console.log("Passcode status updated successfully.");
    sessionStorage.removeItem("passcode");
  } catch (updateError) {
    console.error("Failed to update passcode status:", updateError);
  }
}


      const savedUser = await saveUser({
        id: user!.id,
        name,
        email:user?.primaryEmailAddress?.emailAddress,
        phone,
        address,
        profileImage: uploadedImageUrl,
      }).unwrap();

      if (!savedUser.success) {
        setError("Failed to save user.");
        setSubmitting(false);
        return;
      }

      setSuccess("Registration successful!");
      router.push("/user/courses");
    } catch (err) {
      setError("Server error saving course request.");
    }
    finally{
      setSubmitting(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setSubmitting(true);

  if (!name || !phone || !address || selectedCourses.length === 0) {
    setError("All fields and at least one course selection are required.");
    setSubmitting(false);
    return;
  }

  if (!user?.primaryEmailAddress?.emailAddress) {
  setError("Error retriving user email.. Try again later..");
  setSubmitting(false);
  return;
  }

  try {
    // Upload image if available
    let uploadedImageUrl = "https://example.com/default-profile.png";
    if (profileImage) {
      uploadedImageUrl = await uploadImageAndGetUrl(profileImage);
    }

    // Get passcode from sessionStorage
    const storedPasscode = sessionStorage.getItem("passcode");

    // Call the atomic endpoint
    const result = await registerUserAtomic({
      registerCode: registerCode!,
      userId: user!.id,
      email: user?.primaryEmailAddress?.emailAddress,
      name: name,
      phone,
      address,
      selectedCourseIds: selectedCourses,
      profileImageUrl: uploadedImageUrl,
      registrationEmail : user?.primaryEmailAddress?.emailAddress,
      passcode: storedPasscode || undefined,
    }).unwrap();

    console.log("Registration result:", result);

    if (!result.success) {
      setError(result.message || "Registration failed.");
      setSubmitting(false);
      return;
    }

    // Clear passcode from sessionStorage if it was used
    if (storedPasscode) {
      sessionStorage.removeItem("passcode");
    }

    setSuccess("Registration successful!");
    router.push("/user/courses");
  } catch (err) {
    console.error(err);
    setError("Server error during registration.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="flex justify-center items-center mt-10 px-4 bg-blue-50">
  <form
    onSubmit={handleSubmit}
    className="max-w-2xl w-full bg-white p-8 mt-10 rounded-md shadow-md"
  >
    <h2 className="text-blue-900 text-xl font-semibold mb-6">User Registration</h2>

    {/* Inputs */}
    <input
      type="text"
      placeholder="Full Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full p-3 mb-4 rounded border border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 text-black bg-blue-50 placeholder-blue-700"
    />
    <input
      type="text"
      placeholder="Phone Number"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="w-full p-3 mb-4 rounded border border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 text-black bg-blue-50 placeholder-blue-700"
    />
    <input
      type="text"
      placeholder="Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className="w-full p-3 mb-6 rounded border border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 text-black bg-blue-50 placeholder-blue-700"
    />

    {/* Profile Image Upload */}
    <div className="mb-6">
      <label className="block text-blue-800 font-medium mb-2">Profile Picture</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border border-blue-300 rounded bg-blue-50 text-blue-900"
      />
      {profileImagePreview && (
        <img
          src={profileImagePreview}
          alt="Preview"
          className="mt-3 rounded w-32 h-32 object-cover border border-blue-300"
        />
      )}
    </div>

    {/* Course Selection */}
    <h3 className="text-blue-900 text-lg font-semibold mb-3">Select Courses</h3>

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
      {submitting ? "Saving..." : "Complete Registration"}
    </button>
  </form>
  {submitting && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-blue-900 font-medium">Processing your registration...</p>
    </div>
  </div>
)}

</div>

  );
};

export default RegistrationForm;
