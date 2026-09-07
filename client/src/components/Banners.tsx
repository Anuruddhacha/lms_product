"use client";

import React from "react";
import { useGetAllBannersQuery } from "@/state/api";
import ImageSlider from "./ImageSlider";

const BannerSlider = () => {
  const { data:bannersData, isLoading, isError } = useGetAllBannersQuery();

  if (isLoading) return <p>Loading banners...</p>;
  if (isError) return <p>Error loading banners.</p>;

  // Extract image URLs from banners
  const images = bannersData?.data.map((banner) => banner.imageUrl) || [];

  if (images.length === 0) return <p>No banners available.</p>;

  return <ImageSlider images={images} interval={3000} />;
};

export default BannerSlider;
