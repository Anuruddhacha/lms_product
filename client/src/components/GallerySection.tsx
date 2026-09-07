"use client";

import React from "react";
import { useGetAllGalleryImagesQuery } from "@/state/api";

const GallerySection = () => {
  const { data: galleryData, isLoading, isError } = useGetAllGalleryImagesQuery();

  if (isLoading) return <p className="text-center py-10">Loading gallery...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Error loading gallery.</p>;

  const images = galleryData?.data.map((item) => item.imageUrl) || [];

  if (images.length === 0) return <p className="text-center py-10">No images available.</p>;

  return (
    <section
      id="gallery"
      className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
            Memorable Moments in <span className="text-green-500">SASDI</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Explore moments and glimpses from our events and activities.
          </p>
        </div>

        <div className="overflow-hidden relative">
          <div className="flex animate-scroll gap-6 w-max">
            {images.concat(images).map((src, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 md:w-80 lg:w-96 rounded-2xl shadow-lg dark:shadow-black/40 overflow-hidden group"
              >
                <img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
