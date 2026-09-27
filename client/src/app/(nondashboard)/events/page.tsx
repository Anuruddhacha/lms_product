// app/events/page.tsx or pages/events.tsx
"use client"; // Only for app directory, remove if using pages

import React from "react";
import EventsSection from "@/components/EventsSection";

const EventsPage = () => {
  return (
    <section className="py-20 mt-20 bg-udemy-lightGray">
            <div className="container relative text-center">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-udemy-black mb-4">
                Events & <span className="text-udemy-purple">News</span>
              </h2>
              <p className="text-udemy-gray max-w-xl mx-auto mb-12">
                Discover a world of knowledge and opportunities with our online education platform pursue a new career.
              </p>
              <EventsSection />
            </div>
          </section>
  );
};

export default EventsPage;
