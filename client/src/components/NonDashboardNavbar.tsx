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
    <nav className="w-full bg-white-100 fixed z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-4">
        {/* Left section: Brand + desktop nav */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex flex-row items-center text-udemy-black transition duration-300"
            scroll={false}
          >
            <span className="text-2xl font-black tracking-tight">LMS Platform</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 ml-10 text-sm font-semibold text-udemy-black">
            <Link href="/" className="px-3 py-2 rounded-sm hover:bg-udemy-lightGray transition">Home</Link>
            <Link href="/events" className="px-3 py-2 rounded-sm hover:bg-udemy-lightGray transition">Events</Link>
            <Link href="/feedbacks" className="px-3 py-2 rounded-sm hover:bg-udemy-lightGray transition">Feedbacks</Link>
            <Link href="/aboutus" className="px-3 py-2 rounded-sm hover:bg-udemy-lightGray transition">About Us</Link>
            <Link href="/contactus" className="px-3 py-2 rounded-sm hover:bg-udemy-lightGray transition">Contact Us</Link>
          </div>
        </div>

        {/* Right section: user actions */}
        <div className="hidden md:flex items-center gap-4">
          <SignedIn>
            <Link
              href="/payments"
              className="h-10 px-5 inline-flex items-center justify-center text-sm font-bold rounded-sm bg-udemy-purple text-white-100 hover:bg-udemy-purpleDark transition-colors"
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
              className="h-10 px-5 inline-flex items-center justify-center text-sm font-bold rounded-sm border-2 border-udemy-black text-udemy-black hover:bg-udemy-lightGray transition-colors"
              scroll={false}
            >
              Log in
            </Link>
          </SignedOut>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-udemy-black px-4"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white-100 px-4 pb-4 pt-2 space-y-2 border-b border-gray-200">
          <Link href="/" className="block text-sm text-udemy-black hover:text-udemy-purple transition">Home</Link>
          <Link href="/events" className="block text-sm text-udemy-black hover:text-udemy-purple transition">Events</Link>
          <Link href="/feedbacks" className="block text-sm text-udemy-black hover:text-udemy-purple transition">Feedbacks</Link>
          <Link href="/aboutus" className="block text-sm text-udemy-black hover:text-udemy-purple transition">About Us</Link>
          <Link href="/contactus" className="block text-sm text-udemy-black hover:text-udemy-purple transition">Contact Us</Link>

          <SignedOut>
            <Link href="/signin?isFirstTime=false" className="block w-full text-center text-sm font-medium text-udemy-black hover:text-udemy-purple transition">Log in</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/payments" className="block w-full text-center text-sm font-medium text-udemy-black hover:text-udemy-purple transition">Pay Here</Link>
          </SignedIn>
        </div>
      )}
    </nav>
  );
};

export default NonDashboardNavbar;
