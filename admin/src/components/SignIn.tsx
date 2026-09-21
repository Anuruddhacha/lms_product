"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import React from "react";
import { useSearchParams } from "next/navigation";

const SignInComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  const signUpUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=true`
    : "/signup";

  const getRedirectUrl = () => {
    if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=true`;
    }

    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
      return "/teacher/dashboard";
    }
    return "/user/courses";
  };

  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "shadow-none border border-customgreys-darkerGrey",
          card: "bg-customgreys-secondarybg w-full shadow-none",
          footer: {
            background: "#fafafa",
            padding: "0rem 2.5rem",
            "& > div > div:nth-child(1)": {
              background: "#fafafa",
            },
          },
          formFieldLabel: "text-white-50 font-normal",
          formButtonPrimary:
            "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
          formFieldInput: "bg-white-100 border border-customgreys-darkerGrey text-white-50 !shadow-none",
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

export default SignInComponent;
