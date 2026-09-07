"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Team from '@/components/Team';

export default function Page() {
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
      {/* Academic Staff Section */}
      <section
        id="staff"
        className="flex flex-col min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl overflow-hidden pt-10"
      >
        <section className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 shadow-inner overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
                Meet Our <span className="text-green-500 dark:text-green-500">Academic Instructors</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                Learn from industry-leading professionals who bring real-world experience and a passion for
                teaching.
              </p>
            </div>
            <Team isAcademic={true} />
          </div>
        </section>
      </section>
    </>
  );
}
