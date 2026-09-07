"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";

const cardStyle = (bgColor: string, borderColor: string) =>
  `rounded-2xl p-6 transition duration-200 cursor-pointer shadow hover:shadow-lg text-white border-l-4 ${bgColor} ${borderColor}`;

const Landing = () => {
  const { user, isLoaded } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 min-h-screen px-4 py-10"
    >
      <div className="max-w-6xl mx-auto">
        {!user ? (
               <div className="flex justify-center items-center w-full min-h-[60vh] px-4">
  <div className="bg-gray-800 text-gray-200 px-10 py-10 rounded-2xl shadow-lg text-center w-full max-w-4xl">
    <h2 className="text-3xl font-semibold mb-4">Sign In Required</h2>
    <p className="text-lg text-gray-400">
      Please sign in to access the admin dashboard and manage your content.
    </p>
    <SignInButton mode="modal">
      <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-base">
        Sign In
      </button>
    </SignInButton>
  </div>
</div>


        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Welcome to { "SASDI Admin Panel"}
              </h1>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">
                Manage your courses, students, and content all in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Link href="/teacher/courses" scroll={false}>
                <div
                  className={cardStyle(
                    "bg-pink-600/20",
                    "border-pink-500 hover:border-pink-400"
                  )}
                >
                  <h2 className="text-xl font-semibold mb-2">Create Course</h2>
                  <p className="text-sm text-pink-100">
                    Build and manage your educational content.
                  </p>
                </div>
              </Link>

              <Link href="/teacher/users" scroll={false}>
                <div
                  className={cardStyle(
                    "bg-green-600/20",
                    "border-green-500 hover:border-green-400"
                  )}
                >
                  <h2 className="text-xl font-semibold mb-2">All Students</h2>
                  <p className="text-sm text-green-100">
                    View, monitor, and support enrolled students.
                  </p>
                </div>
              </Link>

              <Link href="/teacher/studentsapplications" scroll={false}>
                <div
                  className={cardStyle(
                    "bg-yellow-600/20",
                    "border-yellow-500 hover:border-yellow-400"
                  )}
                >
                  <h2 className="text-xl font-semibold mb-2">
                    Applications
                  </h2>
                  <p className="text-sm text-yellow-100">
                    Review Student Applications.
                  </p>
                </div>
              </Link>


              <Link href="/teacher/passcodes" scroll={false}>
                <div
                  className={cardStyle(
                    "bg-blue-600/20",
                    "border-blue-500 hover:border-blue-400"
                  )}
                >
                  <h2 className="text-xl font-semibold mb-2">
                    Passcodes
                  </h2>
                  <p className="text-sm text-blue-100">
                    Student Registrations.
                  </p>
                </div>
              </Link>

              <Link href="/teacher/settings" scroll={false}>
                <div
                  className={cardStyle(
                    "bg-red-600/20",
                    "border-red-500 hover:border-red-400"
                  )}
                >
                  <h2 className="text-xl font-semibold mb-2">Settings</h2>
                  <p className="text-sm text-indigo-100">
                    Update your profile, preferences, and platform settings.
                  </p>
                </div>
              </Link>

               <Link href="/teacher/banners" scroll={false}>
                <div
                  className={cardStyle(
                    "bg-purple-600/20",
                    "border-pruple-500 hover:border-purple-400"
                  )}
                >
                  <h2 className="text-xl font-semibold mb-2">Banners</h2>
                  <p className="text-sm text-indigo-100">
                    Update your banners.
                  </p>
                </div>
              </Link>

              <Link href="/teacher/events" scroll={false}>
                <div
                  className={cardStyle(
                    "bg-orange-600/20",
                    "border-orange-500 hover:border-orange-400"
                  )}
                >
                  <h2 className="text-xl font-semibold mb-2">Events</h2>
                  <p className="text-sm text-indigo-100">
                    Update your events.
                  </p>
                </div>
              </Link>


              <Link href="/teacher/gallery" scroll={false}>
                <div
                  className={cardStyle(
                    "bg-indigo-600/20",
                    "border-indigo-500 hover:border-indigo-400"
                  )}
                >
                  <h2 className="text-xl font-semibold mb-2">Gallery</h2>
                  <p className="text-sm text-indigo-100">
                    Update your Gallery.
                  </p>
                </div>
              </Link>

              
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Landing;
