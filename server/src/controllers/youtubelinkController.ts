import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import YouTubeLink from "../models/youtubeLinkModel";

// Create or Save YouTube Link
export const saveYouTubeLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
      res.status(400).json({ message: "YouTube URL is required" });
      return;
    }

    const newLink = new YouTubeLink({
      id: uuidv4(),
      youtubeUrl,
    });

    await newLink.save();

    res.status(200).json({
      message: "YouTube link saved successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error saving YouTube link:", error);
    res.status(500).json({ message: "Server error saving YouTube link", error });
  }
};

// Get All YouTube Links
export const getAllYouTubeLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const links = await YouTubeLink.scan().exec();

    res.status(200).json({
      data: { data: links },
      message: "YouTube links fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching YouTube links:", error);
    res.status(500).json({
      data: { data: [] },
      message: "Failed to fetch YouTube links",
    });
  }
};

// Delete YouTube Link by ID
export const deleteYouTubeLink = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const link = await YouTubeLink.get(id);

    if (!link) {
      res.status(404).json({ message: "YouTube link not found" });
      return;
    }

    await YouTubeLink.delete(id);

    res.status(200).json({ message: "YouTube link deleted successfully", data: link });
  } catch (error) {
    console.error("Error deleting YouTube link:", error);
    res.status(500).json({ message: "Server error deleting YouTube link", error });
  }
};
