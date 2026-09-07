"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiClock,
  FiWifi,
  FiBook
} from "react-icons/fi";

export default function BeautyAyurvedaCourseCard() {
  return (
    <div className="max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <Link href="/courseintro/beauty">
  <div className="w-full overflow-hidden">
    <Image
      src="/beauty_course.jpeg"
      alt="Ayurveda Beauty Course"
      layout="intrinsic"
      width={640} // Replace with your image width
      height={426} // Replace with your image height
      className="w-full transition-transform duration-500 hover:scale-105"
    />
  </div>
</Link>



      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Elegance of Beauty Through Pure Ayurveda
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Become a certified Ayurvedic beauty physician using natural, root-cause healing and diagnostic science—beyond salon standards.
        </p>

        <ul className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <li className="flex items-center space-x-1">
            <FiClock />
            <span>4 Months</span>
          </li>
          <li className="flex items-center space-x-1">
            <FiWifi />
            <span>BAMS, BUMS, BSMS</span>
          </li>
          <li className="flex items-center space-x-1">
            <FiBook />
            <span>60 Lessons</span>
          </li>
        </ul>

        <Link
          href="/courseintro/beauty"
          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
