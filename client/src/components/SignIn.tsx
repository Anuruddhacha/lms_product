"use client";

import { SignIn, useUser, SignUp } from "@clerk/nextjs";
import React, { useState } from "react";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";
import {
  useCheckRegistrationCodeStatusMutation,
  useIsPasscodeTakenQuery,
  useLazyIsPasscodeTakenQuery,
  useSaveRegistrationCodeIfNewMutation,
} from "@/state/api";

const SignInComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");
  const isFirstTime = searchParams.get("isFirstTime") === "true";

  const [registrationCode, setRegistrationCode] = useState("");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // NEW loading state

  const [checkRegistrationCodeStatus] = useCheckRegistrationCodeStatusMutation();
  const [saveRegistrationCodeIfNew] = useSaveRegistrationCodeIfNewMutation();

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");



const [checkPasscodeTrigger] = useLazyIsPasscodeTakenQuery();
const [passcodeError, setPasscodeError] = useState("");
const [checkingPasscode, setCheckingPasscode] = useState(false);
const [showContent, setShowContent] = useState(false);
const [passcode, setPasscode] = useState("");

const handlePasscodeSubmit = async () => {
  if (!passcode.trim()) {
    setPasscodeError("Please enter a passcode.");
    return;
  }

  try {
    setCheckingPasscode(true);
    const res = await checkPasscodeTrigger({ passcode }).unwrap();

    console.log("Passcode check result:", res);

    if (res.isTaken === false) {
      sessionStorage.setItem("passcode", passcode);
      const stored = sessionStorage.getItem("passcode");
      setShowContent(true);
      setPasscodeError("");
    } else {
      setPasscodeError("This passcode is already taken or invalid.");
      setShowContent(false);
    }
  } catch (err: any) {
    setPasscodeError(err?.data?.message || "Unable to verify passcode.");
    setShowContent(false);
  } finally {
    setCheckingPasscode(false);
  }
};







  const signUpUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=true`
    : "/signup";

  const signInUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=false`
    : "/signin";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=true`;
    }

    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
      return "/teacher/courses";
    }
    if (showRegistrationForm) {
      return `/registration?registrationCode=${registrationCode}&registrationEmail=${registrationEmail}`;
    }

    return "/user/courses";
  };

 const validateCode = async () => {


  if (!registrationCode.trim()) {
    setError("Please enter a valid registration code.");
    return;
  }

  if(isFirstTime)
  {

  

    try {
    setLoading(true);
    setError("");
    setIsCodeValid(false);
    setShowRegistrationForm(false);
    const response = await saveRegistrationCodeIfNew({ code: registrationCode, email: registrationEmail, isSavingRequest:false }).unwrap();

    if (response.success) {
      if(!response.alreadyExists)
      {
        setIsCodeValid(true);
        setShowRegistrationForm(true);
      }
    } else if (response.alreadyExists) {
      setError("Registration number or email already exists.");
      setIsCodeValid(false);
    }
    else{
      setError(response.message || "Something went wrong please try again later.");
      setIsCodeValid(false);
    }
    
  } catch (err) {
    //console.error("❌ Save failed", err);
  } finally {
    setLoading(false);
  }
  
  
} else{

try {
    setLoading(true);
    setError("");
    setIsCodeValid(false);
    setShowRegistrationForm(false);

    const response = await checkRegistrationCodeStatus({
      code: registrationCode,
      email: registrationEmail,
    }).unwrap();

    const status = response;

    if (!status.success || status.isHolted) {
      setError(status.message || "Invalid registration code.");
      return;
    }
    

    if (status.isPending) {
      // Awaiting manual approval
      setError("Your registration request is pending approval. Please check back later.");
      return;
    }

    if (status.isAccepted) {
      // Approved code, go to sign in
      setIsCodeValid(true);
      setShowRegistrationForm(false);
      return;
    }

    // Fallback if something unexpected happens
    setError("Unable to verify your code. Please try again later.");
  } catch (error: any) {
    const message = error?.data?.message || error?.error || "Unknown error during validation";
    setError(message);
  } finally {
    setLoading(false);
  }

  }
  
  
};




const renderContent = () => {
  if (!isCodeValid) {
    return (
      <div className="max-w-xl w-full bg-white p-8 rounded-md shadow-md">
  <h2 className="text-blue-900 text-xl font-semibold mb-6">
    Enter Registration Code
  </h2>
  <input
    type="text"
    placeholder="Enter your registration number"
    value={registrationCode}
    onChange={(e) => setRegistrationCode(e.target.value)}
    className="w-full p-3 rounded border border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 text-black mb-4 bg-blue-50 placeholder-blue-700"
  />
  <input
    type="text"
    placeholder="Enter your registration email"
    value={registrationEmail}
    onChange={(e) => setRegistrationEmail(e.target.value)}
    className="w-full p-3 rounded border border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 text-black mb-4 bg-blue-50 placeholder-blue-700"
  />
  {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
  <button
    onClick={validateCode}
    className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-md w-full disabled:opacity-60 transition-colors duration-200"
    disabled={loading}
  >
    {loading ? "Checking..." : "Continue"}
  </button>
</div>

    );
  }

  if (isFirstTime) {
    return (
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
    );
  }

  return (
    <SignIn
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
              formFieldInput: "bg-slate-900 dark:bg-slate-800 text-white-50 !shadow-none",
              footerActionLink: "text-primary-750 hover:text-primary-600",
            },
          }}
          signUpUrl={signUpUrl}
          forceRedirectUrl={getRedirectUrl()}
          routing="hash"
          afterSignOutUrl="/"
        />
  );
};

  // Then in your JSX:
return (
  <div className="flex justify-center items-center py-10 px-4">
    {(!showContent && isFirstTime) ? (
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border border-blue-200">
  <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
    🔒 Enter Passcode
  </h2>
  <p className="text-sm text-gray-600 text-center mb-6">
    Please enter your access passcode to continue.
  </p>
  <input
    type="text"
    value={passcode}
    onChange={(e) => {
      setPasscode(e.target.value);
      setPasscodeError("");
    }}
    placeholder="------"
    className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black focus:border-blue-500 mb-3 transition"
  />
  {passcodeError && (
    <p className="text-red-600 text-sm mb-4 text-center">{passcodeError}</p>
  )}
  <button
    onClick={handlePasscodeSubmit}
    disabled={checkingPasscode}
    className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
  >
    {checkingPasscode ? "Verifying..." : "Continue"}
  </button>

  <p className="text-sm text-gray-600 text-center mt-6">
    Don’t have a passcode?{" "}
    <a
      href="/contactus"
      className="text-blue-700 hover:underline font-medium"
    >
      Contact us to get one
    </a>
  </p>
</div>

    ) : (
      renderContent()
    )}
  </div>
);
};

export default SignInComponent;
