"use client";

import React, { useEffect, useState } from "react";
import ScrollToTop from "@/components/scroll-top";
import ContactUs from "@/components/ContactUs";
import Loading from "@/components/Loading";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <section className="relative pt-32 md:pb-24 pb-16 bg-white-100">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Heading */}
          <div className="md:flex justify-center">
            <div className="lg:w-3/5 text-center md:text-left">
              <h3 className="text-4xl font-semibold text-udemy-black leading-tight">
                Get in Touch With Us
              </h3>
              <div className="flex items-center justify-center md:justify-start mt-4">
                <span className="font-semibold block text-udemy-purple">
                  LMS Platform
                </span>
              </div>
            </div>
          </div>

          {/* Intro Text */}
          <div className="md:flex justify-center text-center mt-8">
            <div className="lg:w-4/5">
              <p className="text-udemy-gray text-lg leading-relaxed">
                Have questions or need assistance? Our team is here to help you explore our courses, clarify doubts, or support your learning journey.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:flex justify-center mt-12">
            <div className="lg:w-full">
              <div className="bg-white-100 border border-gray-200 shadow-md rounded-md p-8">
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
