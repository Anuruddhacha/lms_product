"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";

const SignUpComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  const [registrationCode, setRegistrationCode] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [error, setError] = useState("");

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState(""); // optional, depends on your flow
  

  const signInUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=false`
    : "/signin";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=false`;
    }

    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
      return "/teacher/courses";
    }

    if(showRegistrationForm){
    return `/registration?registrationCode=${registrationCode}`;
   }

    return "/user/courses";
  };


const validateCode = async () => {
  try {
  
  } catch (error: any) {
    // Handle failed requests (e.g., 400, 500, network issues)
    const message = error?.data?.message || error?.error || "Unknown error during validation";
    //console.error("❌ Validation failed:", message);
    setError("Invalid or expired registration code.");
    // Optionally show an error toast
  }

 };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      {!isCodeValid ? (
        <div className="max-w-md w-full bg-slate-900 dark:bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-white text-lg font-semibold mb-4">
            Enter Registration Code
          </h2>
          <input
            type="text"
            placeholder="Enter your registration number"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
            className="w-full p-2 rounded bg-slate-900 dark:bg-slate-800 text-white mb-2"
          />
          <input
            type="text"
            placeholder="Enter your registration email"
            value={registrationEmail}
            onChange={(e) => setRegistrationEmail(e.target.value)}
            className="w-full p-2 rounded bg-slate-900 dark:bg-slate-800 text-white mb-2"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={validateCode}
            className="bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded w-full"
          >
            Continue
          </button>
        </div>
      ) : (
        <SignUp
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "flex justify-center items-center py-5",
              cardBox: "shadow-none",
              card: "bg-customgreys-secondarybg w-full shadow-none",
              footer: {
                background: "#25262F",
                padding: "0rem 2.5rem",
                "& > div > div:nth-child(1)": {
                  background: "#25262F",
                },
              },
              formFieldLabel: "text-white-50 font-normal",
              formButtonPrimary:
                "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
              formFieldInput:
                "bg-slate-900 dark:bg-slate-800 text-white-50 !shadow-none",
              footerActionLink: "text-primary-750 hover:text-primary-600",
            },
          }}
          signInUrl={signInUrl}
          forceRedirectUrl={getRedirectUrl()}
          routing="hash"
          afterSignOutUrl="/"
        />
      )}
    </div>
  );
};

export default SignUpComponent;
