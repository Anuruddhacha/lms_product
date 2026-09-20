"use client";

import {
  useDeleteBannerMutation,
  useGetAllBannersQuery,
  useGetUploadBannerImageUrlMutation,
  useSaveBannerMutation,
} from "@/state/api";
import Image from "next/image";
import React, { useState } from "react";

const BannerUploadForm = () => {
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [getUploadBannerImageUrl] = useGetUploadBannerImageUrlMutation();
  const [saveBanner] = useSaveBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const {
    data: bannersData,
    isLoading: isBannersLoading,
    refetch: refetchBanners,
  } = useGetAllBannersQuery();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!bannerImage) {
      setError("Please select a banner image.");
      return;
    }

    setUploading(true);
    try {
      const { name: fileName, type: fileType } = bannerImage;

      const { uploadUrl, imageUrl } = await getUploadBannerImageUrl({
        fileName,
        fileType,
      }).unwrap();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: bannerImage,
      });

      const res = await saveBanner({ imageUrl }).unwrap();

      if (!res.success) {
        setError("Failed to save banner.");
      } else {
        setSuccess("Banner uploaded successfully!");
        setBannerImage(null);
        setPreviewUrl(null);
        refetchBanners(); // Refresh banners list
      }
    } catch (err) {
      console.error("Banner upload failed", err);
      setError("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id).unwrap();
      refetchBanners();
    } catch (err) {
      console.error("Failed to delete banner", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">Upload Banner</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-4 border border-blue-300 rounded p-2"
        />

        {previewUrl && (
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded border">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-blue-600 mb-2">{success}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload Banner"}
        </button>
      </form>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-4 text-blue-800">All Banners</h3>
      {isBannersLoading ? (
        <p>Loading banners...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bannersData?.data.map((banner) => (
            <div
              key={banner.id}
              className="relative border rounded overflow-hidden shadow-sm"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={banner.imageUrl}
                  alt="Banner"
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <button
                onClick={() => handleDelete(banner.id)}
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

export default BannerUploadForm;
