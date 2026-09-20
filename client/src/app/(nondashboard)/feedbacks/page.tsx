"use client"; // For app directory. Remove if using pages/

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetAllFeedbackQuery } from "@/state/api"; // Make sure this hook exists and is working

const FeedbacksPage = () => {
  const { data: feedbackData, isLoading, isError } = useGetAllFeedbackQuery();
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [allVideos, setAllVideos] = useState<string[]>([]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p>Loading feedbacks...</p>
      </div>
    );

  if (isError || !feedbackData?.data)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-red-600">Failed to load feedbacks.</p>
      </div>
    );

  if (feedbackData.data.length === 0)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-600">No feedbacks available.</p>
      </div>
    );

  return (
    <section className="py-20 mt-20 bg-gradient-to-br  shadow-inner">
      <div className="container relative text-center">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
          Student <span className="text-blue-500">Feedbacks</span>
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-12">
          Hear directly from our students about their experiences and growth.
        </p>

        <div className="mt-6 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {feedbackData.data.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-gray-700 transition-all overflow-hidden"
            >
              {/* Video Section */}
              <div className="relative h-52 w-full overflow-hidden">
                {item.feedbackVideoUrl ? (
                  <video
                    src={item.feedbackVideoUrl}
                    controls
                    className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
                    onClick={() => {
                      setAllVideos(
                        feedbackData.data
                          .map((f) => f.feedbackVideoUrl)
                          .filter((url): url is string => typeof url === "string")
                      );
                      setModalVideo(item.feedbackVideoUrl ?? null);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Video
                  </div>
                )}
              </div>

              {/* Feedback Text */}
              {item.feedback && (
                <div className="p-5">
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-4">
                    {item.feedback}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Viewer */}
      {modalVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setModalVideo(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                const currentIndex = allVideos.indexOf(modalVideo);
                const prevIndex =
                  (currentIndex - 1 + allVideos.length) % allVideos.length;
                setModalVideo(allVideos[prevIndex]);
              }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-70 z-50"
            >
              <FiChevronLeft className="w-8 h-8" />
            </button>

            <video
              src={modalVideo}
              controls
              className="max-h-[90vh] max-w-full rounded-xl shadow-lg"
            />

            <button
              onClick={() => {
                const currentIndex = allVideos.indexOf(modalVideo);
                const nextIndex = (currentIndex + 1) % allVideos.length;
                setModalVideo(allVideos[nextIndex]);
              }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-70 z-50"
            >
              <FiChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeedbacksPage;
