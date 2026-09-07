// app/about/page.tsx OR pages/about.tsx

import React from "react";
import AboutOne from "@/components/AboutOne";

export default function AboutPage() {
  return (
    <section
      className="flex flex-col min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl overflow-hidden mt-5"
    >
      <section
        className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 shadow-inner overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
              Who We <span className="text-green-500 dark:text-green-400">Are</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Learn from industry-leading professionals who bring real-world experience and a passion for teaching.
            </p>
          </div>

          <AboutOne title={false} />

          <div className="mt-16 max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl aspect-video">
            <iframe
              src="https://www.youtube.com/embed/mokNMI6GDxs"
              title="About Us Video"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </section>
  );
}
