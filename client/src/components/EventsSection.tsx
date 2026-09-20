"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetAllEventsQuery } from "@/state/api";
import { usePathname } from "next/navigation";

export default function EventsSection() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const { data: eventsData, isLoading, isError } = useGetAllEventsQuery();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p>Loading events...</p>
      </div>
    );

  if (isError || !eventsData?.data)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-red-600">Failed to load events.</p>
      </div>
    );

  if (eventsData.data.length === 0)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-600">No events available.</p>
      </div>
    );

  return (
    <>
      <div className="mt-6 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {eventsData.data.map((item) => {
          const isExpanded = expandedIds.includes(item.id);
          const subImages: string[] = item.subImages || [];

          return (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-gray-700 transition-all duration-500 overflow-hidden"
            >
              {/* Main Image */}
             <div className="relative h-52 w-full overflow-hidden">
  {item.imageUrl ? (() => {
    const ext = item.imageUrl.split('.').pop()?.toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '');
    const isVideo = ['mp4', 'webm', 'ogg'].includes(ext || '');

    if (isImage) {
      const imgElement = (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
        />
      );
      return isHomePage ? <Link href="/events">{imgElement}</Link> : imgElement;
    }

    if (isVideo) {
      return (
        <video
          src={item.imageUrl}
          controls
          className="w-full h-full object-cover"
        />
      );
    }

    // Fallback if media type is not supported
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
        Unsupported Media
      </div>
    );
  })() : (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
      No Media
    </div>
  )}
</div>


              {/* Sub Images Grid */}
              {!isHomePage && subImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 px-4 py-3">
                  {subImages.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`sub-${i}`}
                      className="w-full h-28 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                      setAllImages(subImages); // set all for this card
                      setModalImage(url);       // open clicked image
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="p-6 pt-2">
                {item.date && (
  <div className="flex justify-between mb-2 text-sm text-slate-600">
    <span className="flex items-center">
      <FiCalendar className="size-4 me-1" />
      {item.date}
    </span>
  </div>
)}


                <Link
                  href={`/events`}
                  className="block text-lg font-semibold text-gray-800 hover:text-blue-700 transition"
                >
                  {item.title}
                </Link>

                {isExpanded && (
                  <p className="mt-3 text-sm text-gray-600">{item.description}</p>
                )}

                <div className="mt-3">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-sm font-medium text-blue-700 hover:text-blue-900 transition"
                  >
                    {isExpanded ? "Show Less ←" : "Read More →"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {modalImage !== null && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    onClick={() => setModalImage(null)}
  >
    {/* Prevent background click from closing modal */}
    <div
      className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          const currentIndex = allImages.indexOf(modalImage);
          const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
          setModalImage(allImages[prevIndex]);
        }}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-70 z-50"
      >
        <FiChevronLeft className="w-8 h-8" />
      </button>

      <img
        src={modalImage}
        alt="Preview"
        className="max-h-[90vh] max-w-full rounded-xl shadow-lg"
      />

      <button
        onClick={() => {
          const currentIndex = allImages.indexOf(modalImage);
          const nextIndex = (currentIndex + 1) % allImages.length;
          setModalImage(allImages[nextIndex]);
        }}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-70 z-50"
      >
        <FiChevronRight className="w-8 h-8" />
      </button>
    </div>
  </div>
)}

    </>
  );
}
