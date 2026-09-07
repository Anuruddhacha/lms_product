import { Request, Response } from "express";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import Banner from "../models/bannerModel";
import Event from  "../models/eventModel";
import GalleryImage from "../models/galleryModel";
import Notice from "../models/noticeModel";

const s3 = new AWS.S3();

export const getUploadBannerImageUrl = async (
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
    const s3Key = `banners/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 300, // 5 minutes
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const imageUrl = `${process.env.CLOUDFRONT_DOMAIN}/banners/${uniqueId}/${fileName}`;

    res.status(200).json({
      message: "Banner upload URL generated successfully",
      data: { uploadUrl, imageUrl },
    });
  } catch (error) {
    console.error("Error generating banner upload URL:", error);
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};



export const saveBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ message: "Image URL is required" });
      return;
    }

    const newBanner = new Banner({
      id: uuidv4(),
      imageUrl,
    });

    await newBanner.save();

    res.status(200).json({
      message: "Banner saved successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error saving banner:", error);
    res.status(500).json({ message: "Server error saving banner", error });
  }
};


export const getAllBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await Banner.scan().exec();

    res.status(200).json({
      data: { data: banners },
      message: "Banners fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      data: { data: [] },
      message: "Failed to fetch banners",
    });
  }
};



export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const banner = await Banner.get(id);

    if (!banner) {
      res.status(404).json({ message: "Banner not found" });
      return;
    }

    const key = extractS3KeyFromUrl(banner.imageUrl);
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
      .promise();

     await Banner.delete(id);

    res.status(200).json({ message: "Banner deleted successfully", data:banner });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Server error deleting banner", error });
  }
};



//Notices

// Generate a pre-signed URL for uploading a notice PDF
export const getUploadNoticePdfUrl = async (
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
    const s3Key = `notices/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 300, // 5 minutes
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const pdfUrl = `${process.env.CLOUDFRONT_DOMAIN}/notices/${uniqueId}/${fileName}`;

    res.status(200).json({
      message: "Notice upload URL generated successfully",
      data: { uploadUrl, pdfUrl },
    });
  } catch (error) {
    console.error("Error generating notice upload URL:", error);
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};

// Save a new notice
export const saveNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pdfUrl, notice } = req.body;

    if (!pdfUrl || !notice) {
      res.status(400).json({ message: "PDF URL and notice text are required" });
      return;
    }

    const newNotice = new Notice({
      id: uuidv4(),
      pdfUrl,
      notice,
    });

    await newNotice.save();

    res.status(200).json({
      message: "Notice saved successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error saving notice:", error);
    res.status(500).json({ message: "Server error saving notice", error });
  }
};

// Get all notices
export const getAllNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const notices = await Notice.scan().exec();

    res.status(200).json({
      data: { data: notices },
      message: "Notices fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({
      data: { data: [] },
      message: "Failed to fetch notices",
    });
  }
};

// Delete a notice (and delete the PDF from S3)
export const deleteNotice = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const notice = await Notice.get(id);

    if (!notice) {
      res.status(404).json({ message: "Notice not found" });
      return;
    }

    const key = extractS3KeyFromUrl(notice.pdfUrl);

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
      .promise();

    await Notice.delete(id);

    res.status(200).json({ message: "Notice deleted successfully", data: notice });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ message: "Server error deleting notice", error });
  }
};


//Events

export const getUploadEventImageUrl = async (
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
    const s3Key = `events/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 300,
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const imageUrl = `${process.env.CLOUDFRONT_DOMAIN}/events/${uniqueId}/${fileName}`;

    res.status(200).json({
      message: "Event upload URL generated successfully",
      data: { uploadUrl, imageUrl },
    });
  } catch (error) {
    console.error("Error generating event upload URL:", error);
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};

export const saveEvent2 = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, date, description, imageUrl } = req.body;

    if (!title || !date || !description) {
      res.status(400).json({ message: "Title, date, and description are required" });
      return;
    }

    const newEvent = new Event({
      id: uuidv4(),
      title,
      date,
      description,
      imageUrl, // Optional
    });

    await newEvent.save();

    res.status(200).json({
      message: "Event saved successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ message: "Server error saving event", error });
  }
};



export const saveEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, date, description, imageUrl, subImages } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: "Title, date, and description are required" });
      return;
    }

    // Validate subImages: must be an array of strings (URLs)
    const validatedSubImages = Array.isArray(subImages) && subImages.every(img => typeof img === "string")
      ? subImages
      : [];

    const newEvent = new Event({
      id: uuidv4(),
      title,
      date,
      description,
      imageUrl,
      subImages: validatedSubImages, // optional
    });

    await newEvent.save();

    res.status(200).json({
      message: "Event saved successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ message: "Server error saving event", error });
  }
};


export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.scan().exec();

    res.status(200).json({
      data: { data: events },
      message: "Events fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      data: { data: [] },
      message: "Failed to fetch events",
    });
  }
};

function extractS3KeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  const rawKey = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;
  return decodeURIComponent(rawKey); // 💥 decode %20 to space
}

export const deleteEvent2 = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await Event.get(id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (event.imageUrl) {
      const key = extractS3KeyFromUrl(event.imageUrl);
      await s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
        })
        .promise();
    }

    await Event.delete(id);

    res.status(200).json({ message: "Event deleted successfully", data: event });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error deleting event", error });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await Event.get(id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Delete main image from S3
    if (event.imageUrl) {
      const key = extractS3KeyFromUrl(event.imageUrl);
      await s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
        })
        .promise();
    }

    // Delete all subImages from S3
    if (Array.isArray(event.subImages)) {
      const deletePromises = event.subImages.map((url: string) => {
        const key = extractS3KeyFromUrl(url);
        return s3
          .deleteObject({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
          })
          .promise();
      });
      await Promise.all(deletePromises);
    }

    // Delete event record from DynamoDB
    await Event.delete(id);

    res.status(200).json({ message: "Event deleted successfully", data: event });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error deleting event", error });
  }
};



//Gallery

export const getUploadGalleryImageUrl = async (
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
    const s3Key = `gallery/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 300,
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const imageUrl = `${process.env.CLOUDFRONT_DOMAIN}/gallery/${uniqueId}/${fileName}`;

    res.status(200).json({
      message: "Gallery image upload URL generated successfully",
      data: { uploadUrl, imageUrl },
    });
  } catch (error) {
    console.error("Error generating gallery upload URL:", error);
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};


export const saveGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ message: "Image URL is required" });
      return;
    }

    const newImage = new GalleryImage({
      id: uuidv4(),
      imageUrl,
    });

    await newImage.save();

    res.status(200).json({
      message: "Gallery image saved successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error saving gallery image:", error);
    res.status(500).json({ message: "Server error saving gallery image", error });
  }
};


export const getAllGalleryImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const images = await GalleryImage.scan().exec();

    res.status(200).json({
      data: { data: images },
      message: "Gallery images fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).json({
      data: { data: [] },
      message: "Failed to fetch gallery images",
    });
  }
};


export const deleteGalleryImage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const image = await GalleryImage.get(id);

    if (!image) {
      res.status(404).json({ message: "Gallery image not found" });
      return;
    }

    const key = extractS3KeyFromUrl(image.imageUrl); // You already use this function

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
      .promise();

    await GalleryImage.delete(id);

    res.status(200).json({ message: "Gallery image deleted successfully", data: image });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    res.status(500).json({ message: "Server error deleting gallery image", error });
  }
};