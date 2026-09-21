"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import {
  BookOpen,
  Users,
  ClipboardList,
  KeyRound,
  Settings as SettingsIcon,
  Image as ImageIcon,
  CalendarDays,
  GalleryHorizontalEnd,
} from "lucide-react";

const cardStyle = (bgColor: string) =>
  `rounded-2xl p-6 transition duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 text-gray-900 ${bgColor}`;

const iconWrapStyle = (iconBg: string, iconColor: string) =>
  `w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg} ${iconColor}`;

const Landing = () => {
  const { user, isLoaded } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-customgreys-secondarybg min-h-screen px-6 sm:px-10 lg:px-16 py-10"
    >
      <div className="max-w-[1600px] mx-auto">
        {!user ? (
               <div className="flex justify-center items-center w-full min-h-[60vh] px-4">
  <div className="bg-white border border-customgreys-darkerGrey text-gray-900 px-10 py-10 rounded-2xl shadow-lg text-center w-full max-w-4xl">
    <h2 className="text-3xl font-semibold mb-4">Sign In Required</h2>
    <p className="text-lg text-gray-500">
      Please sign in to access the admin dashboard and manage your content.
    </p>
    <SignInButton mode="modal">
      <button className="mt-6 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-base">
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
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome to { "LMS Platform Admin Panel"}
              </h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Manage your courses, students, and content all in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              <Link href="/teacher/courses" scroll={false}>
                <div className={cardStyle("bg-pink-100")}>
                  <div className={iconWrapStyle("bg-pink-200", "text-pink-700")}>
                    <BookOpen size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Create Course</h2>
                  <p className="text-sm text-gray-600">
                    Build and manage your educational content.
                  </p>
                </div>
              </Link>

              <Link href="/teacher/users" scroll={false}>
                <div className={cardStyle("bg-orange-100")}>
                  <div className={iconWrapStyle("bg-orange-200", "text-orange-700")}>
                    <Users size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">All Students</h2>
                  <p className="text-sm text-gray-600">
                    View, monitor, and support enrolled students.
                  </p>
                </div>
              </Link>

              <Link href="/teacher/studentsapplications" scroll={false}>
                <div className={cardStyle("bg-violet-100")}>
                  <div className={iconWrapStyle("bg-violet-200", "text-violet-700")}>
                    <ClipboardList size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    Applications
                  </h2>
                  <p className="text-sm text-gray-600">
                    Review Student Applications.
                  </p>
                </div>
              </Link>


              <Link href="/teacher/passcodes" scroll={false}>
                <div className={cardStyle("bg-sky-100")}>
                  <div className={iconWrapStyle("bg-sky-200", "text-sky-700")}>
                    <KeyRound size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    Passcodes
                  </h2>
                  <p className="text-sm text-gray-600">
                    Student Registrations.
                  </p>
                </div>
              </Link>

              <Link href="/teacher/settings" scroll={false}>
                <div className={cardStyle("bg-amber-100")}>
                  <div className={iconWrapStyle("bg-amber-200", "text-amber-700")}>
                    <SettingsIcon size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Settings</h2>
                  <p className="text-sm text-gray-600">
                    Update your profile, preferences, and platform settings.
                  </p>
                </div>
              </Link>

               <Link href="/teacher/banners" scroll={false}>
                <div className={cardStyle("bg-emerald-100")}>
                  <div className={iconWrapStyle("bg-emerald-200", "text-emerald-700")}>
                    <ImageIcon size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Banners</h2>
                  <p className="text-sm text-gray-600">
                    Update your banners.
                  </p>
                </div>
              </Link>

              <Link href="/teacher/events" scroll={false}>
                <div className={cardStyle("bg-rose-100")}>
                  <div className={iconWrapStyle("bg-rose-200", "text-rose-700")}>
                    <CalendarDays size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Events</h2>
                  <p className="text-sm text-gray-600">
                    Update your events.
                  </p>
                </div>
              </Link>


              <Link href="/teacher/gallery" scroll={false}>
                <div className={cardStyle("bg-fuchsia-100")}>
                  <div className={iconWrapStyle("bg-fuchsia-200", "text-fuchsia-700")}>
                    <GalleryHorizontalEnd size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Gallery</h2>
                  <p className="text-sm text-gray-600">
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
