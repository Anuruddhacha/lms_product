import { useGetAllReviewsQuery, useSaveReviewMutation } from "@/state/api";
import Link from "next/link";
import React, { useState } from "react";

function FeedbackSection() {
  const { data, isLoading, isError, refetch } = useGetAllReviewsQuery({ isTop: true });
  const [saveReview, { isLoading: saving }] = useSaveReviewMutation();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    feedback: "",
    rating: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.feedback || formData.rating === 0) {
      alert("Please fill in your name, feedback, and rating.");
      return;
    }

    try {
      await saveReview(formData).unwrap();
      setFormData({ name: "", role: "", feedback: "", rating: 0 });
      refetch();
    } catch (error) {
      alert("Failed to submit review.");
      console.error(error);
    }
  };

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
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10">
          What Our Students Say
        </h2>

        {reviewsContent}

        <div className="mb-10">
       <Link href="/allreveiws" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow transition">
       View All Reviews
      </Link>

</div>

        {/* Review Submission Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">
            Add Your Review
          </h3>

          <input
            type="text"
            name="name"
            placeholder="Your Name*"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded text-black border-gray-300"
            required
          />

          <input
            type="text"
            name="role"
            placeholder="Your Role (optional)"
            value={formData.role}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded text-black border-gray-300"
          />

          <textarea
            name="feedback"
            placeholder="Your Feedback*"
            value={formData.feedback}
            onChange={handleChange}
            rows={4}
            className="w-full mb-4 p-3 border rounded text-black border-gray-300"
            required
          />

          <label className="block mb-2 text-left text-gray-700">
            Rating*
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full mb-6 p-3 border rounded text-black border-gray-300"
            required
          >
            <option value={0}>Select Rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition disabled:opacity-50"
          >
            {saving ? "Submitting..." : "Submit Review"}
          </button>
        </form>
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
    <div className="max-w-md bg-white rounded-lg p-6 shadow-md text-left border border-gray-200">
      <p className="text-gray-900 mb-4">{feedback}</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold uppercase">
          {name[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
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

export default FeedbackSection;
