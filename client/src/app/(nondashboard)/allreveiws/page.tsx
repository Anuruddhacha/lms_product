"use client";

import React from "react";
import { useGetAllReviewsQuery } from "@/state/api";

function AllReviewsPage() {
  const { data, isLoading, isError, refetch } = useGetAllReviewsQuery({ isTop: false });

  const reviews: any[] = Array.isArray(data?.data) ? data.data : [];

  let reviewsContent: React.ReactNode;
  if (isLoading) {
    reviewsContent = <p>Loading reviews...</p>;
  } else if (isError) {
    reviewsContent = <p className="text-red-500">Failed to load reviews.</p>;
  } else {
    reviewsContent = (
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {reviews.map(({ name, role, feedback, rating }, i) => (
          <FeedbackCard
            key={i}
            name={name}
            role={role}
            feedback={feedback}
            rating={rating || 5}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="py-20 mt-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
          All Student Reviews
        </h2>

        {reviewsContent}
      </div>
    </section>
  );
}

type FeedbackCardProps = {
  name: string;
  role: string;
  feedback: string;
  rating: number;
};

function FeedbackCard({ name, role, feedback, rating }: FeedbackCardProps) {
  return (
    <div className="max-w-sm bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-left border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
      <p className="text-gray-900 dark:text-gray-100 mb-4 break-words">{feedback}</p>
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold uppercase">
          {name[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{name}</p>
          <p className="text-sm text-green-600">{role}</p>
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex mt-1 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 fill-current ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.91L10 2l2.939 5 6.061.91-4.822 4.09 1.7 6.09z" />
        </svg>
      ))}
    </div>
  );
}

export default AllReviewsPage;
