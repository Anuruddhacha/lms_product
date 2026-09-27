"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  KeyRound,
  Settings as SettingsIcon,
  Image as ImageIcon,
  CalendarDays,
  GalleryHorizontalEnd,
  MessageSquare,
  Bell,
  Lock,
  ArrowRight,
} from "lucide-react";

type Tile = {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
};

const sections: { label: string; tiles: Tile[] }[] = [
  {
    label: "Course Management",
    tiles: [
      {
        href: "/teacher/dashboard",
        icon: LayoutDashboard,
        title: "Dashboard",
        description: "See enrollment trends and course performance at a glance.",
      },
      {
        href: "/teacher/courses",
        icon: BookOpen,
        title: "Courses",
        description: "Build and manage your educational content.",
      },
      {
        href: "/teacher/users",
        icon: Users,
        title: "All Students",
        description: "View, monitor, and support enrolled students.",
      },
      {
        href: "/teacher/studentsapplications",
        icon: ClipboardList,
        title: "Applications",
        description: "Review and approve student applications.",
      },
      {
        href: "/teacher/passcodes",
        icon: KeyRound,
        title: "Passcodes",
        description: "Generate and manage student registration passcodes.",
      },
    ],
  },
  {
    label: "Content & Media",
    tiles: [
      {
        href: "/teacher/banners",
        icon: ImageIcon,
        title: "Banners",
        description: "Update the homepage banner carousel.",
      },
      {
        href: "/teacher/events",
        icon: CalendarDays,
        title: "Events",
        description: "Post and manage upcoming events.",
      },
      {
        href: "/teacher/gallery",
        icon: GalleryHorizontalEnd,
        title: "Gallery",
        description: "Manage photos shown on the public gallery.",
      },
      {
        href: "/teacher/notices",
        icon: Bell,
        title: "Notices",
        description: "Publish notices and YouTube links for students.",
      },
      {
        href: "/teacher/feedbacks",
        icon: MessageSquare,
        title: "Feedbacks",
        description: "Review student feedback and testimonials.",
      },
    ],
  },
  {
    label: "Account",
    tiles: [
      {
        href: "/teacher/settings",
        icon: SettingsIcon,
        title: "Settings",
        description: "Update your profile, preferences, and platform settings.",
      },
    ],
  },
];

const Landing = () => {
  const { user, isLoaded } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-udemy-lightGray min-h-screen px-6 sm:px-10 lg:px-16 py-10"
    >
      <div className="max-w-[1600px] mx-auto">
        {!user ? (
          <div className="flex justify-center items-center w-full min-h-[60vh] px-4">
            <div className="bg-white-100 border border-gray-200 text-udemy-black px-10 py-10 rounded-md shadow-lg text-center w-full max-w-4xl">
              <div className="w-14 h-14 rounded-full bg-udemy-purple text-white-100 flex items-center justify-center mx-auto mb-5">
                <Lock size={26} />
              </div>
              <h2 className="text-3xl font-semibold mb-4">Sign In Required</h2>
              <p className="text-lg text-udemy-gray">
                Please sign in to access the admin dashboard and manage your content.
              </p>
              <SignInButton mode="modal">
                <button className="mt-6 px-6 py-3 bg-udemy-purple hover:bg-udemy-purpleDark text-white-100 font-bold rounded-sm text-base transition-colors">
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
            className="space-y-10"
          >
            <div className="bg-udemy-purple rounded-md px-8 py-10 sm:px-12 sm:py-12 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white-100/10" />
              <div className="absolute right-16 bottom-0 w-28 h-28 rounded-full bg-white-100/10" />
              <div className="relative">
                <h1 className="text-3xl sm:text-4xl font-bold text-white-100">
                  Welcome back{user.firstName ? `, ${user.firstName}` : ""}
                </h1>
                <p className="mt-2 text-white-100/80 text-sm sm:text-base max-w-lg">
                  Manage your courses, students, and content all in one place.
                </p>
              </div>
            </div>

            {sections.map((section) => (
              <div key={section.label}>
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-udemy-black mb-4">
                  <span className="w-1.5 h-4 rounded-full bg-udemy-purple" />
                  {section.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {section.tiles.map((tile) => (
                    <Link key={tile.href} href={tile.href} scroll={false} className="group">
                      <div className="rounded-md p-6 h-full transition-all duration-200 cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg hover:border-udemy-purple text-udemy-black bg-white-100">
                        <div className="w-11 h-11 rounded-md flex items-center justify-center mb-4 bg-udemy-purple text-white-100">
                          <tile.icon size={22} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                          {tile.title}
                          <ArrowRight
                            size={16}
                            className="text-udemy-purple opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                          />
                        </h3>
                        <p className="text-sm text-udemy-gray">{tile.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Landing;
