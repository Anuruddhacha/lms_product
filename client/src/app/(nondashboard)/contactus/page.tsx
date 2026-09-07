"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ScrollToTop from "@/components/scroll-top";
import ContactUs from "@/components/ContactUs";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Image
          src="/SASDI_WD.png"
          alt="SASDI Logo"
          width={200}
          height={200}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <>
      <section className="relative pt-32 md:pb-24 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Heading */}
          <div className="md:flex justify-center">
            <div className="lg:w-3/5 text-center md:text-left">
              <h3 className="text-4xl font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                Get in Touch With Us
              </h3>
              <div className="flex items-center justify-center md:justify-start mt-4">
                <Image
                  src="/SASDI_WD.png"
                  width={36}
                  height={36}
                  className="rounded-full shadow-md dark:shadow-gray-800"
                  alt="SASDI Logo"
                />
                <span className="font-semibold block ms-3 text-green-700 dark:text-green-400">
                  Sanathana Ayurveda Skill Development Institute
                </span>
              </div>
            </div>
          </div>

          {/* Intro Text */}
          <div className="md:flex justify-center text-center mt-8">
            <div className="lg:w-4/5">
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                Have questions or need assistance? Our team is here to help you explore our courses, clarify doubts, or support your learning journey.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:flex justify-center mt-12">
            <div className="lg:w-full">
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
                <ContactUs />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  );
}
