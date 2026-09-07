import { Request, Response } from "express";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import Review from "../models/reviewSchema";

const s3 = new AWS.S3();

// Since review does not involve image upload, no S3 upload URL generation is needed.

// Save a new review
export const saveReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, feedback, rating } = req.body;

    // Validate required fields
    if (!name || !feedback || !rating) {
      res.status(400).json({ message: "Name, feedback, and rating are required" });
      return;
    }

    // Validate rating range (1 to 5)
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      res.status(400).json({ message: "Rating must be a number between 1 and 5" });
      return;
    }

    const newReview = new Review({
      id: uuidv4(),
      name,
      role,
      feedback,
      rating,
    });

    await newReview.save();

    res.status(200).json({
      message: "Review saved successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Server error saving review", error });
  }
};

// Get all reviews
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {

  const isTop = req.query.isTop === 'true';

  try {
    let reviews;

    if (isTop) {
      // Get only 5-star reviews
      const fiveStarReviews = await Review.scan("rating").eq(5).exec();

      // Sort by feedback length descending and take top 5
      reviews = fiveStarReviews
        .sort((a, b) => b.feedback.length - a.feedback.length)
        .slice(0, 5);
    } else {
      // Get all reviews and sort by rating descending
      const allReviews = await Review.scan().exec();
      reviews = allReviews.sort((a, b) => b.rating - a.rating);
    }

    res.status(200).json({
      data: { data: reviews },
      message: isTop
        ? "Top 5 longest 5-star reviews fetched successfully"
        : "All reviews sorted by rating fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      data: { data: [] },
      message: "Failed to fetch reviews",
    });
  }
};

// Delete a review by id
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const review = await Review.get(id);

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    await Review.delete(id);

    res.status(200).json({ message: "Review deleted successfully", data: review });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error deleting review", error });
  }
};
