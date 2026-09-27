"use client";

import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import BannerSlider from "@/components/Banners";
import GallerySection from "@/components/GallerySection";
import EventsSection from "@/components/EventsSection";
import FeedbackSection from "@/components/FeedbackSection";
import Loading from "@/components/Loading";
import { useGetAllNoticesQuery, useGetAllYouTubeLinksQuery } from "@/state/api";


const LandingContent = () => {
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
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">

      {/* Hero Section */}
      <section className="relative py-24 bg-udemy-black overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 items-center">
            <div>
              <h1 className="font-extrabold lg:leading-tight leading-snug tracking-tight text-3xl lg:text-4xl mb-5 text-white-100">
                Empowering{" "}
                <span className="relative inline-block">
                  <span className="absolute inset-0 -skew-y-3 bg-udemy-purple rounded-md"></span>
                  <span className="relative text-white-100 px-2 font-black">Global</span>
                </span>{" "}
                Learners
                <br />
                Through <span className="font-extrabold text-udemy-purple">Quality Education</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-xl">
                Discover a world of knowledge and opportunities with our online education platform pursue a new career.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <SignedIn>
                  <Link
                    href="/user/courses"
                    className="h-12 px-6 tracking-wide inline-flex items-center justify-center font-bold rounded-sm bg-udemy-purple text-white-100 hover:bg-udemy-purpleDark transition-colors"
                  >
                    View Courses
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/signin?isFirstTime=true"
                    className="h-12 px-6 inline-flex items-center justify-center font-bold rounded-sm bg-udemy-purple text-white-100 hover:bg-udemy-purpleDark transition-colors"
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
<section className="py-16 bg-white-100">
  <div className="max-w-5xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-udemy-black mb-10">
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
      <section className="py-20 bg-udemy-lightGray">
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

      {/* Feedback Section */}
<FeedbackSection/>

      {/* Notice and PDF Section */}

    <section className="py-20 bg-white-100">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-udemy-black mb-8">
      Important Notice
    </h2>

    {isLoading && (
      <p className="text-center text-udemy-gray">Loading notice...</p>
    )}

    {isError && (
      <p className="text-center text-red-600">Failed to load notice.</p>
    )}

    {firstNotice && (
      <>
        <p className="text-center text-udemy-gray max-w-2xl mx-auto mb-12">
          Please read the following document carefully. This notice contains essential information for all current and prospective students.
        </p>

        {/* PDF Embed */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl aspect-video border border-gray-200 rounded-md overflow-hidden shadow-lg">
            <iframe
              src={firstNotice.pdfUrl}
              title="Important Notice PDF"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Notice Text */}
        <div className="bg-udemy-purpleLight text-udemy-black p-6 rounded-md border border-udemy-purple/20">
          <p className="text-center font-medium">
            📢 <strong>Notice:</strong>{" "}
            {firstNotice.notice}
          </p>
        </div>
      </>
    )}

    {!isError && !firstNotice && (
      <p className="text-center text-udemy-gray">No notices available.</p>
    )}
  </div>
</section>

    </div>
  );
};

export default LandingContent;
