"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import React, { useState } from "react";
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
        <div className="max-w-md w-full bg-white-100 p-6 rounded-md shadow border border-gray-200">
          <h2 className="text-udemy-black text-lg font-semibold mb-4">
            Enter Registration Code
          </h2>
          <input
            type="text"
            placeholder="Enter your registration number"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 bg-white-100 text-udemy-black mb-2"
          />
          <input
            type="text"
            placeholder="Enter your registration email"
            value={registrationEmail}
            onChange={(e) => setRegistrationEmail(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 bg-white-100 text-udemy-black mb-2"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={validateCode}
            className="bg-udemy-purple hover:bg-udemy-purpleDark text-white-100 font-bold px-4 py-2 rounded-sm w-full"
          >
            Continue
          </button>
        </div>
      ) : (
        <SignUp
          appearance={{
            elements: {
              rootBox: "flex justify-center items-center py-5",
              cardBox: "shadow-none",
              card: "bg-white-100 w-full shadow-none border border-gray-200",
              footer: {
                background: "#ffffff",
                padding: "0rem 2.5rem",
                "& > div > div:nth-child(1)": {
                  background: "#ffffff",
                },
              },
              formFieldLabel: "text-udemy-black font-normal",
              formButtonPrimary:
                "bg-udemy-purple text-white-100 hover:bg-udemy-purpleDark !shadow-none",
              formFieldInput:
                "bg-white-100 border border-gray-300 text-udemy-black !shadow-none",
              footerActionLink: "text-udemy-purple hover:text-udemy-purpleDark",
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
