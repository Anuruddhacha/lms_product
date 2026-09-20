// app/events/page.tsx or pages/events.tsx
"use client"; // Only for app directory, remove if using pages

import React from "react";
import EventsSection from "@/components/EventsSection";

const EventsPage = () => {
  return (
    <section className="py-20 mt-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 shadow-inner">
            <div className="container relative text-center">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
                Events & <span className="text-blue-500">News</span>
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto mb-12">
                Discover a world of knowledge and opportunities with our online education platform pursue a new career.
              </p>
              <EventsSection />
            </div>
          </section>
  );
};

export default EventsPage;
