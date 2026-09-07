import { Request, Response } from "express";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import Feedback from "../models/feedbackModel";

const s3 = new AWS.S3();

function extractS3KeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  const rawKey = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;
  return decodeURIComponent(rawKey);
}

// Generate a pre-signed URL for uploading feedback video
export const getUploadFeedbackVideoUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    res.status(400).json({ message: "File name and type are required" });
    return;
  }

  try {
    const uniqueId = uuidv4();
    const s3Key = `feedbacks/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 300,
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/feedbacks/${uniqueId}/${fileName}`;

    res.status(200).json({
      message: "Feedback video upload URL generated successfully",
      data: { uploadUrl, videoUrl },
    });
  } catch (error) {
    console.error("Error generating feedback video upload URL:", error);
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};

// Save feedback
export const saveFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { feedback, feedbackVideoUrl } = req.body;

    if (!feedback) {
      res.status(400).json({ message: "Feedback text is required" });
      return;
    }

    const newFeedback = new Feedback({
      id: uuidv4(),
      feedback,
      feedbackVideoUrl, // Optional
    });

    await newFeedback.save();

    res.status(200).json({
      message: "Feedback saved successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Server error saving feedback", error });
  }
};

// Get all feedback
export const getAllFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const feedbacks = await Feedback.scan().exec();

    res.status(200).json({
      data: { data: feedbacks },
      message: "Feedbacks fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({
      data: { data: [] },
      message: "Failed to fetch feedbacks",
    });
  }
};

// Delete feedback
export const deleteFeedback = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.get(id);

    if (!feedback) {
      res.status(404).json({ message: "Feedback not found" });
      return;
    }

    // Delete video from S3 if exists
    if (feedback.feedbackVideoUrl) {
      const key = extractS3KeyFromUrl(feedback.feedbackVideoUrl);
      await s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
        })
        .promise();
    }

    await Feedback.delete(id);

    res.status(200).json({ message: "Feedback deleted successfully", data: feedback });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error deleting feedback", error });
  }
};
