"use client";

import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Faqs from "@/components/Faqs";
import Link from "next/link";
import Image from "next/image";
import BannerSlider from "@/components/Banners";
import GallerySection from "@/components/GallerySection";
import EventsSection from "@/components/EventsSection";
import FeedbackCard from "@/components/FeedbackCard";
import FeedbackSection from "@/components/FeedbackSection";
import { useGetAllNoticesQuery, useGetAllYouTubeLinksQuery } from "@/state/api";


const Landing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: noticesData, isError } = useGetAllNoticesQuery();
  const firstNotice = noticesData?.data?.[0];

  // Inside the component
const {
  data: youtubeLinksData,
  isLoading: isYoutubeLinksLoading,
} = useGetAllYouTubeLinksQuery();

// Outside or at bottom of the file
const extractVideoId = (url: string) => {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};



  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Image
          src="/logo.svg"
          alt="LMS Platform Logo"
          width={200}
          height={200}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">

      {/* Hero Section */}
      <section
        className="relative py-36 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 shadow-inner overflow-hidden"
        style={{ backgroundImage: `url('/images/bg/bg.png')` }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 items-center">
            <div>
              <h1 className="font-extrabold lg:leading-tight leading-snug tracking-tight text-3xl lg:text-3xl mb-5 text-gray-900 dark:text-white">
                Empowering{" "}
                <span className="relative inline-block">
                  <span className="absolute inset-0 -skew-y-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-600 rounded-md"></span>
                  <span className="relative text-white px-2 font-black">Global</span>
                </span>{" "}
                Learners
                <br />
                Through <span className="font-extrabold text-blue-700 dark:text-blue-400">Quality Education</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-xl">
                Discover a world of knowledge and opportunities with our online education platform pursue a new career.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6">
                <SignedIn>
                  <Link
                    href="/user/courses"
                    className="h-12 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-blue-600 text-white"
                  >
                    View Courses
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/signin?isFirstTime=true"
                    //href="/"
                    //onClick={(e) => e.preventDefault()}
                    className="h-12 px-6 inline-flex items-center justify-center font-semibold rounded-md bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    Register Now
                  </Link>
                </SignedOut>
              </div>
            </div>

            {/* Image Slider */}
            <BannerSlider />
          </div>
        </div>
      </section>

      {/* Video Section */}
{/* Video Section */}
<section className="py-16 bg-transparent">
  <div className="max-w-5xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">
      Watch Our Videos
    </h2>

    {isYoutubeLinksLoading ? (
      <p className="text-center">Loading videos...</p>
    ) : !youtubeLinksData?.data?.length ? (
      <p className="text-center text-gray-500">No videos available.</p>
    ) : (
      <div className="flex flex-col gap-12">
        {youtubeLinksData.data.map((link) => {
          const videoId = extractVideoId(link.youtubeUrl);
          return (
            <div
              key={link.id}
              className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`YouTube video ${link.id}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          );
        })}
      </div>
    )}
  </div>
</section>



      {/* Gallery */}
      <GallerySection />

      {/* Events */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 shadow-inner">
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

     
     { /*<section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 shadow-inner">
        <div className="container relative text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
            FAQ
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-12">
            Discover a world of knowledge and opportunities with our online education platform pursue a new career.
          </p>
          <Faqs />
        </div>
      </section>*/}


      {/* Feedback Section */}
<FeedbackSection/>

      {/* Notice and PDF Section */}
    
    <section className="py-20 bg-gradient-to-br from-white-100 to-white-100 dark:from-yellow-900 dark:to-yellow-950 shadow-inner">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">
      Important Notice
    </h2>

    {isLoading && (
      <p className="text-center text-slate-600 dark:text-slate-300">Loading notice...</p>
    )}

    {isError && (
      <p className="text-center text-red-600">Failed to load notice.</p>
    )}

    {firstNotice && (
      <>
        <p className="text-center text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-12">
          Please read the following document carefully. This notice contains essential information for all current and prospective students.
        </p>

        {/* PDF Embed */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl aspect-video border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden shadow-lg">
            <iframe
              src={firstNotice.pdfUrl}
              title="Important Notice PDF"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Notice Text */}
        <div className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 p-6 rounded-md shadow">
          <p className="text-center font-medium">
            📢 <strong>Notice:</strong>{" "}
            {firstNotice.notice}
          </p>
        </div>
      </>
    )}

    {!isError && !firstNotice && (
      <p className="text-center text-slate-500">No notices available.</p>
    )}
  </div>
</section>



    </div>
  );
};

export default Landing;
