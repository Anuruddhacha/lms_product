"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  useGetUploadEventImageUrlMutation,
  useSaveEventMutation,
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "@/state/api";

type LocalImage = {
  file: File;
  previewUrl: string;
};

type LocalMedia = {
  file: File;
  previewUrl: string;
  type: string; // MIME type like "image/jpeg" or "video/mp4"
};


const EventUploadForm = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [subImages, setSubImages] = useState<LocalImage[]>([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [mainMedia, setMainMedia] = useState<LocalMedia | null>(null);


  const [getUploadEventImageUrl] = useGetUploadEventImageUrlMutation();
  const [saveEvent] = useSaveEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const {
    data: eventsData,
    isLoading: isEventsLoading,
    refetch: refetchEvents,
  } = useGetAllEventsQuery();


  const handleMainMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (file) {

    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    alert("HEIC images are not supported. Please upload JPG or PNG.");
    return;
  }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Only images and videos are allowed for main media.");
      return;
    }
    setMainMedia({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type,
    });
  }
};



  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newSubImages = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSubImages((prev) => [...prev, ...newSubImages]);
  };

  const removeSubImage = (index: number) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, onProgress: (p: number) => void): Promise<string> => {
    const { uploadUrl, imageUrl } = await getUploadEventImageUrl({
      fileName: file.name,
      fileType: file.type,
    }).unwrap();

    if (!uploadUrl || !imageUrl) {
      window.alert("Something went wrong. Please try again.");
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(imageUrl);
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed due to network error"));

      xhr.send(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploadProgress(0);

    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    const totalUploads = (mainMedia ? 1 : 0) + subImages.length;
    let completedUploads = 0;
    const updateOverallProgress = () => {
      completedUploads += 1;
      setUploadProgress(Math.round((completedUploads / (totalUploads + 1)) * 100)); // +1 for saving event
    };

    try {
      setUploading(true);
      let mainMediaUrl: string | undefined;

      if (mainMedia) {
        mainMediaUrl = await uploadFile(mainMedia.file, () => {});
        updateOverallProgress();
      }

      const subImageUrls: string[] = [];

      for (let i = 0; i < subImages.length; i++) {
        const url = await uploadFile(subImages[i].file, () => {});
        subImageUrls.push(url);
        updateOverallProgress();
      }

      await saveEvent({
        title,
        date,
        description,
        imageUrl: mainMediaUrl,
        subImages: subImageUrls,
      }).unwrap();

      updateOverallProgress();

      setSuccess("Event uploaded successfully!");
      setTitle("");
      setDate("");
      setDescription("");
      setMainMedia(null);
      setSubImages([]);
      refetchEvents();
    } catch (err) {
      console.error("Upload error", err);
      setError("Failed to upload event. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await deleteEvent(id).unwrap();
      refetchEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
    finally {
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

    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-900">Upload Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          className="w-full mb-3 border border-green-300 rounded p-2 text-black"
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-3 border border-green-300 rounded p-2 text-black"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event Description"
          className="w-full mb-3 border border-green-300 rounded p-2 text-black"
          rows={4}
          required
        />

        {/* Main Media Upload */}
        <div className="mb-4">
  <label className="block mb-2 font-semibold text-green-900">Main Media</label>
  <input
    type="file"
    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
    onChange={handleMainMediaChange}
    disabled={uploading}
    className="w-full border border-green-300 rounded p-2"
  />
  {mainMedia && (
  <div className="mt-2 relative w-full h-48 border rounded overflow-hidden">
    {mainMedia.type.startsWith("image/") ? (
      <Image
        src={mainMedia.previewUrl}
        alt="Preview"
        fill
        className="object-cover"
        unoptimized
        sizes="(max-width: 896px) 100vw, 896px"
      />
    ) : (
      <video
        src={mainMedia.previewUrl}
        controls
        className="w-full h-full object-cover"
      />
    )}
    <button
      type="button"
      onClick={() => setMainMedia(null)}
      className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
    >
      Remove
    </button>
  </div>
)}
</div>


        {/* Sub Images */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-green-900">Sub Images</label>
          <input
            type="file"
            multiple
            disabled={uploading}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleSubImagesChange}
            className="w-full border border-green-300 rounded p-2"
          />
          <div className="grid grid-cols-3 gap-4 mt-3">
            {subImages.map((img, idx) => (
              <div
                key={idx}
                className="relative h-24 overflow-hidden rounded border"
              >
                <Image
                  src={img.previewUrl}
                  alt={`sub-${idx}`}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(max-width: 896px) 33vw, 280px"
                />
                <button
                  type="button"
                  onClick={() => removeSubImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        {uploading && (
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
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
          {uploading ? "Posting Event..." : "Post Event"}
        </button>
      </form>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-4 text-green-800">All Events</h3>
      {isEventsLoading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventsData?.data.map((event) => (
            <div
              key={event.id}
              className="relative border rounded overflow-hidden shadow-sm p-3"
            >
              {event.imageUrl && (() => {
  const ext: string = (event.imageUrl.split('.').pop() ?? '').toLowerCase();

  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
    return (
      <div className="relative mb-2 h-32 w-full overflow-hidden rounded">
        <Image
          src={event.imageUrl}
          alt="Event"
          fill
          className="object-cover"
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    );
  }

  if (['mp4', 'webm', 'ogg'].includes(ext)) {
    return (
      <video
        src={event.imageUrl}
        controls
        className="w-full h-32 object-cover rounded mb-2"
      />
    );
  }

  if (['mp3', 'wav', 'ogg'].includes(ext)) {
    return (
      <audio
        src={event.imageUrl}
        controls
        className="w-full w-full mb-2"
      />
    );
  }

  return null; // fallback if unknown
})()}
              <h4 className="font-semibold text-black">{event.title}</h4>
              <p className="text-sm text-gray-700 mb-1">{event.date}</p>
              <p className="text-gray-700 text-sm">{event.description}</p>
              <button
                onClick={() => handleDelete(event.id)}
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

export default EventUploadForm;
