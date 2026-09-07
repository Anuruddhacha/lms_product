"use client";

import React, { useState } from "react";
import {
  useGetUploadFeedbackVideoUrlMutation,
  useSaveFeedbackMutation,
  useGetAllFeedbackQuery,
  useDeleteFeedbackMutation,
} from "@/state/api";

const FeedbackUploadForm = () => {
  const [feedback, setFeedback] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [getUploadFeedbackVideoUrl] = useGetUploadFeedbackVideoUrlMutation();
  const [saveFeedback] = useSaveFeedbackMutation();
  const [deleteFeedback] = useDeleteFeedbackMutation();

  const {
    data: feedbacksData,
    isLoading: isFeedbacksLoading,
    refetch: refetchFeedbacks,
  } = useGetAllFeedbackQuery();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideo(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid video file (mp4, webm, etc).");
    }
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const { uploadUrl, videoUrl } = await getUploadFeedbackVideoUrl({
      fileName: file.name,
      fileType: file.type,
    }).unwrap();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) resolve(videoUrl);
        else reject(new Error("Upload failed"));
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploading(true);
    setUploadProgress(0);

    try {
      let feedbackVideoUrl;

      if (video) {
        feedbackVideoUrl = await uploadVideo(video);
      }

      await saveFeedback({ feedback, feedbackVideoUrl }).unwrap();

      setSuccess("Feedback submitted successfully!");
      setFeedback("");
      setVideo(null);
      setPreviewUrl("");
      refetchFeedbacks();
    } catch (err) {
      console.error("Feedback submission failed:", err);
      setError("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await deleteFeedback(id).unwrap();
      refetchFeedbacks();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {deleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">Deleting...</div>
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">Uploading...</div>
        </div>
      )}

      <div className="max-w-2xl mx-auto mt-10 bg-white shadow p-6 rounded">
        <h2 className="text-2xl font-bold mb-4 text-green-900">Submit Feedback</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback..."
            className="w-full mb-4 p-2 border border-green-300 rounded text-black"
            rows={4}
            required
          />

          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleVideoChange}
            className="mb-3"
            disabled={uploading}
          />

          {previewUrl && (
            <div className="mb-3 relative">
              <video src={previewUrl} controls className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => {
                  setVideo(null);
                  setPreviewUrl("");
                }}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                Remove
              </button>
            </div>
          )}

          {error && <p className="text-red-600 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          {uploading && (
            <div className="w-full h-3 bg-gray-200 rounded-full mb-3">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600 disabled:opacity-60"
          >
            {uploading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <hr className="my-8" />

        <h3 className="text-xl font-semibold mb-4 text-green-800">All Feedback</h3>

        {isFeedbacksLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {feedbacksData?.data.map((fb) => (
              <div key={fb.id} className="border p-3 rounded shadow relative">
                <p className="text-black mb-2">{fb.feedback}</p>
                {fb.feedbackVideoUrl && (
                  <video src={fb.feedbackVideoUrl} controls className="w-full h-48 object-cover" />
                )}
                <button
                  onClick={() => handleDelete(fb.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FeedbackUploadForm;
