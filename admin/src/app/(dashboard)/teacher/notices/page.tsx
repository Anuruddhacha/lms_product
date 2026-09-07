"use client";

import React, { useState } from "react";
import {
  useGetUploadNoticePdfUrlMutation,
  useSaveNoticeMutation,
  useGetAllNoticesQuery,
  useDeleteNoticeMutation,
  useGetAllYouTubeLinksQuery,
  useSaveYouTubeLinkMutation,
  useDeleteYouTubeLinkMutation,
} from "@/state/api";

const NoticeUploadForm = () => {
  const [noticeFile, setNoticeFile] = useState<File | null>(null);
  const [noticeText, setNoticeText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [getUploadNoticePdfUrl] = useGetUploadNoticePdfUrlMutation();
  const [saveNotice] = useSaveNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();

  const {
    data: noticesData,
    isLoading: isNoticesLoading,
    refetch: refetchNotices,
  } = useGetAllNoticesQuery();


  // Inside NoticeUploadForm component
const [youtubeUrl, setYoutubeUrl] = useState("");
const [saveYouTubeLink] = useSaveYouTubeLinkMutation();
const [deleteYouTubeLink] = useDeleteYouTubeLinkMutation();

const {
  data: youtubeLinksData,
  isLoading: isYoutubeLinksLoading,
  refetch: refetchYoutubeLinks,
} = useGetAllYouTubeLinksQuery();

const handleYoutubeSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!youtubeUrl.trim()) {
    setError("Please enter a valid YouTube URL.");
    return;
  }

  try {
    const res = await saveYouTubeLink({ youtubeUrl }).unwrap();

    if (!res.success) {
      setError("Failed to save YouTube link.");
    } else {
      setSuccess("YouTube link saved successfully!");
      setYoutubeUrl("");
      refetchYoutubeLinks();
    }
  } catch (err) {
    console.error("Failed to save YouTube link", err);
    setError("Something went wrong while saving the link.");
  }
};

const handleYoutubeDelete = async (id: string) => {
  try {
    await deleteYouTubeLink(id).unwrap();
    refetchYoutubeLinks();
  } catch (err) {
    console.error("Failed to delete YouTube link", err);
  }
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNoticeFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!noticeFile) {
      setError("Please select a PDF file.");
      return;
    }
    if (!noticeText.trim()) {
      setError("Please enter notice text.");
      return;
    }

    setUploading(true);
    try {
      const { name: fileName, type: fileType } = noticeFile;

      const { uploadUrl, pdfUrl } = await getUploadNoticePdfUrl({
        fileName,
        fileType,
      }).unwrap();

      console.log("Upload URL:", uploadUrl);

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: noticeFile,
      });

      const res = await saveNotice({ pdfUrl, notice: noticeText }).unwrap();

      if (!res.success) {
        setError("Failed to save notice.");
      } else {
        setSuccess("Notice uploaded successfully!");
        setNoticeFile(null);
        setNoticeText("");
        setPreviewUrl(null);
        refetchNotices();
      }
    } catch (err) {
      console.error("Notice upload failed", err);
      setError("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotice(id).unwrap();
      refetchNotices();
    } catch (err) {
      console.error("Failed to delete notice", err);
    }
  };

  const extractVideoId = (url: string) => {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};


  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-900">Upload Notice</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full mb-4 border border-green-300 rounded p-2"
        />

        {previewUrl && (
          <div className="mb-4">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Preview PDF
            </a>
          </div>
        )}

        <textarea
          placeholder="Enter notice text"
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          className="w-full mb-4 border border-green-300 rounded p-2"
          rows={3}
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload Notice"}
        </button>
      </form>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-4 text-green-800">All Notices</h3>
      {isNoticesLoading ? (
        <p>Loading notices...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {noticesData?.data.map((notice) => (
            <div
              key={notice.id}
              className="relative border rounded p-4 shadow-sm bg-gray-50"
            >
              <p className="mb-2 text-sm">{notice.notice}</p>
              <a
                href={notice.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mb-2 block"
              >
                View PDF
              </a>
              <button
                onClick={() => handleDelete(notice.id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}


      <hr className="my-8" />

<h3 className="text-xl font-semibold mb-4 text-green-800">Add YouTube Link</h3>
<form onSubmit={handleYoutubeSubmit} className="mb-6">
  <input
    type="url"
    placeholder="Enter YouTube URL"
    value={youtubeUrl}
    onChange={(e) => setYoutubeUrl(e.target.value)}
    className="w-full mb-4 border border-green-300 rounded p-2"
  />
  <button
    type="submit"
    className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-600"
  >
    Save YouTube Link
  </button>
</form>

<h3 className="text-xl font-semibold mb-4 text-green-800">All YouTube Links</h3>
{isYoutubeLinksLoading ? (
  <p>Loading YouTube links...</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {youtubeLinksData?.data.map((link) => (
      <div
        key={link.id}
        className="relative border rounded p-4 shadow-sm bg-gray-50"
      >
        <iframe
          className="w-full h-48 mb-2"
          src={`https://www.youtube.com/embed/${extractVideoId(link.youtubeUrl)}`}
          allowFullScreen
        ></iframe>
        <a
          href={link.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline mb-2 block text-sm break-all"
        >
          {link.youtubeUrl}
        </a>
        <button
          onClick={() => handleYoutubeDelete(link.id)}
          className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    ))}
  </div>
)}


    </div>
  );
};

export default NoticeUploadForm;
