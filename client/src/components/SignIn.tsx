"use client";

import { SignIn, useUser, SignUp } from "@clerk/nextjs";
import React, { useState } from "react";
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
      <div className="max-w-xl w-full bg-white-100 p-8 rounded-md shadow-md border border-gray-200">
  <h2 className="text-udemy-black text-xl font-semibold mb-6">
    Enter Registration Code
  </h2>
  <input
    type="text"
    placeholder="Enter your registration number"
    value={registrationCode}
    onChange={(e) => setRegistrationCode(e.target.value)}
    className="w-full p-3 rounded border border-gray-300 focus:border-udemy-purple focus:ring-2 focus:ring-udemy-purple/30 text-udemy-black mb-4 bg-white-100 placeholder-udemy-gray"
  />
  <input
    type="text"
    placeholder="Enter your registration email"
    value={registrationEmail}
    onChange={(e) => setRegistrationEmail(e.target.value)}
    className="w-full p-3 rounded border border-gray-300 focus:border-udemy-purple focus:ring-2 focus:ring-udemy-purple/30 text-udemy-black mb-4 bg-white-100 placeholder-udemy-gray"
  />
  {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
  <button
    onClick={validateCode}
    className="bg-udemy-purple hover:bg-udemy-purpleDark text-white-100 font-bold px-6 py-3 rounded-sm w-full disabled:opacity-60 transition-colors duration-200"
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
    );
  }

  return (
    <SignIn
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
              formFieldInput: "bg-white-100 border border-gray-300 text-udemy-black !shadow-none",
              footerActionLink: "text-udemy-purple hover:text-udemy-purpleDark",
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
      <div className="bg-white-100 shadow-lg rounded-md p-8 max-w-md w-full border border-gray-200">
  <h2 className="text-2xl font-bold text-udemy-black mb-4 text-center">
    🔒 Enter Passcode
  </h2>
  <p className="text-sm text-udemy-gray text-center mb-6">
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
    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-udemy-purple/30 text-udemy-black focus:border-udemy-purple mb-3 transition"
  />
  {passcodeError && (
    <p className="text-red-600 text-sm mb-4 text-center">{passcodeError}</p>
  )}
  <button
    onClick={handlePasscodeSubmit}
    disabled={checkingPasscode}
    className="w-full py-3 bg-udemy-purple hover:bg-udemy-purpleDark text-white-100 font-bold rounded-sm transition disabled:opacity-50"
  >
    {checkingPasscode ? "Verifying..." : "Continue"}
  </button>

  <p className="text-sm text-udemy-gray text-center mt-6">
    Don’t have a passcode?{" "}
    <a
      href="/contactus"
      className="text-udemy-purple hover:underline font-medium"
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
