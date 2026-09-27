// app/about/page.tsx OR pages/about.tsx

import React from "react";
import AboutOne from "@/components/AboutOne";

export default function AboutPage() {
  return (
    <section
      className="flex flex-col min-h-screen w-full bg-white-100 overflow-hidden mt-5"
    >
      <section
        className="relative py-24 bg-udemy-lightGray overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-udemy-black mb-4">
              Who We <span className="text-udemy-purple">Are</span>
            </h2>
            <p className="text-lg text-udemy-gray max-w-2xl mx-auto">
              Learn from industry-leading professionals who bring real-world experience and a passion for teaching.
            </p>
          </div>

          <AboutOne title={false} />
        </div>
      </section>
    </section>
  );
}
