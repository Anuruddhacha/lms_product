"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const NonDashboardNavbar = () => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed z-50 dark:bg-white-100 dark:bg-opacity-90"
     style={{
  backgroundColor: 'rgba(255, 255, 255, 0.2)', // 60% opacity white (more transparent)
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 0 3px rgba(60, 72, 88, 0.15)',
}}
>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section: Brand + desktop nav */}
        <div className="flex items-center">
  <Link
  href="/"
  className="flex flex-row items-center text-blue-600 hover:text-blue-700 transition duration-300 pb-3"
  scroll={false}
>
  <img
    src="/logo.svg"
    alt="LMS Platform Logo"
    className="h-28 w-28 object-contain mr-4 sm:h-24 sm:w-24"
  />
  <span className="text-5xl sm:text-4xl font-black tracking-wider pt-4">LMS Platform</span>
</Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 ml-10 text-base font-semibold text-gray-800 dark:text-gray-200">
            <Link href="/" className="px-2 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition">Home</Link>
            <Link href="/events" className="px-2 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition">Events</Link>
            <Link href="/feedbacks" className="px-2 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition">Feedbacks</Link>
            <Link href="/aboutus" className="px-2 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition">About Us</Link>
            <Link href="/contactus" className="px-2 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition">Contact Us</Link>
          </div>
        </div>

        {/* Right section: user actions */}
        <div className="hidden md:flex items-center gap-4">
          <SignedIn>
            <Link
              href="/payments"
              className="h-12 px-6 inline-flex items-center justify-center font-semibold rounded-md bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              scroll={false}
            >
              Pay Here
            </Link>
            <UserButton
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                  userButtonBox: "scale-90 sm:scale-100",
                },
              }}
              showName={false}
              userProfileMode="navigation"
              userProfileUrl={
                userRole === "teacher" ? "/teacher/profile" : "/user/profile"
              }
            />
          </SignedIn>

          <SignedOut>
            <Link
              href="/signin?isFirstTime=false"
              className="h-12 px-6 inline-flex items-center justify-center font-semibold rounded-md bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              scroll={false}
            >
              LMS Login
            </Link>

            <Link
              href="/payments"
              className="h-12 px-6 inline-flex items-center justify-center font-semibold rounded-md bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              scroll={false}
            >
              Pay Here
            </Link>
          </SignedOut>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 dark:text-white px-4"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pb-4 pt-2 space-y-2 shadow-md rounded-b-xl transition-all duration-300">
          <Link href="/" className="block text-sm text-gray-700 dark:text-white hover:text-blue-500 transition">Home</Link>
          <Link href="/events" className="block text-sm text-gray-700 dark:text-white hover:text-blue-500 transition">Events</Link>
          <Link href="/feedbacks" className="block text-sm text-gray-700 dark:text-white hover:text-blue-500 transition">Feedbacks</Link>
          <Link href="/aboutus" className="block text-sm text-gray-700 dark:text-white hover:text-blue-500 transition">About Us</Link>
          <Link href="/contactus" className="block text-sm text-gray-700 dark:text-white hover:text-blue-500 transition">Contact Us</Link>
       
          <SignedOut>
            <Link href="/signin?isFirstTime=false" className="block w-full text-center text-sm font-medium text-gray-700 dark:text-white hover:text-blue-500 transition">LMS Login</Link>
          </SignedOut>
          <Link href="/payments" className="block w-full text-center text-sm font-medium text-gray-700 dark:text-white hover:text-blue-500 transition">Pay Here</Link>
        </div>
      )}
    </nav>
  );
};

export default NonDashboardNavbar;
