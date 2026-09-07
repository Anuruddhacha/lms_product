"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiClock,
  FiWifi,
  FiBook
} from "react-icons/fi";

export default function CourseIntroCard() {
  return (
    <div className="max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
       <Link href="/courseintro/ayurvedic">
        <div className="w-full overflow-hidden">
          <Image
            src="/ayurveda_course.jpeg"
            alt="Ayurveda Course"
            layout="intrinsic"
            width={800} // adjust based on your image
            height={533} // adjust based on your image
            className="w-full transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Certificate in Proficiency of Ayurveda
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          A modern, holistic Ayurveda program blending ancient wisdom and medical science to build diagnostic and healing skills.
        </p>

        <ul className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <li className="flex items-center space-x-1">
            <FiClock />
            <span>12 Months</span>
          </li>
          <li className="flex items-center space-x-1">
            <FiWifi />
            <span>BAMS, BUMS, BSMS</span>
          </li>
          <li className="flex items-center space-x-1">
            <FiBook />
            <span>160 Lessons</span>
          </li>
        </ul>

        <Link
          href="/courseintro/ayurvedic"
          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
