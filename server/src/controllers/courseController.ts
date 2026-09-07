import { Request, Response } from "express";
import Course from "../models/courseModel";
import AWS from "aws-sdk";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";

const s3 = new AWS.S3();

export const listCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.query;
  try {
    const courses =
      category && category !== "all"
        ? await Course.scan("category").eq(category).exec()
        : await Course.scan().exec();
    res.json({ message: "Courses retrieved successfully", data: courses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};

export const getAllCourses = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.scan().exec();
    res.json({ message: "Courses retrieved successfully", data: courses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};

/** Fields needed for admin course list (avoids loading huge `sections` / resources → faster, smaller payload). */
const LIST_COURSE_SUMMARY_ATTRIBUTES = [
  "courseId",
  "teacherId",
  "teacherName",
  "title",
  "description",
  "category",
  "image",
  "price",
  "level",
  "status",
  "enrollments",
] as const;

/**
 * `GET /getallcourses` — projected scan so Lambda is less likely to hit API Gateway / Lambda timeouts
 * on large courses (full `getAllCourses` remains on `GET /courses/all`).
 */
export const listAllCourse = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const rows = await Course.scan()
      .attributes([...LIST_COURSE_SUMMARY_ATTRIBUTES])
      .exec();

    const plain = JSON.parse(JSON.stringify(rows)) as Record<
      string,
      unknown
    >[];

    const courses = plain.map((c) => ({
      ...c,
      sections: [],
      description: c.description ?? "",
      zoomLinks: [],
      youtubeLinks: [],
      uploadedResources: [],
    }));

    res.json({ message: "Courses retrieved successfully", data: courses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.json({ message: "Course retrieved successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving course", error });
  }
};

export const getCoursesByIds = async (req: Request, res: Response): Promise<void> => {
  const { courseIds } = req.body;

  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    res.status(400).json({ message: "courseIds must be a non-empty array" });
    return;
  }

  try {
    // Dynamoose batchGet
    const courses = await Course.batchGet(courseIds);

    res.json({
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses by IDs:", error);
    res.status(500).json({ message: "Error fetching courses", error });
  }
};


export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teacherId, teacherName } = req.body;

    if (!teacherId || !teacherName) {
      res.status(400).json({ message: "Teacher Id and name are required" });
      return;
    }

    const newCourse = new Course({
      courseId: uuidv4(),
      teacherId,
      teacherName,
      title: "Untitled Course",
      description: "",
      category: "Uncategorized",
      image: "",
      price: 0,
      level: "Beginner",
      status: "Draft",
      sections: [],
      enrollments: [],
      uploadedResources: [], 
      zoomLinks: [],         
      youtubeLinks: [],   
    });
    await newCourse.save();

    res.json({ message: "Course created successfully", data: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error });
  }
};

export const updateCourse2 = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);


  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    /*if (course.teacherId !== userId) {
      res
        .status(403)
        .json({ message: "Not authorized to update this course" });
      return;
    }*/

    // Convert and validate price if present
    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        res.status(400).json({
          message: "Invalid price format",
          error: "Price must be a valid number",
        });
        return;
      }
      updateData.price = price * 100;
    }

    // Parse and format sections if provided
    if (updateData.sections) {
      const sectionsData =
        typeof updateData.sections === "string"
          ? JSON.parse(updateData.sections)
          : updateData.sections;

      updateData.sections = sectionsData.map((section: any) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        chapters: section.chapters.map((chapter: any) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
        })),
      }));
    }

    // Handle uploadedResources
    if (updateData.uploadedResources) {
      updateData.uploadedResources = Array.isArray(updateData.uploadedResources)
        ? updateData.uploadedResources
        : JSON.parse(updateData.uploadedResources);
    }

    // Handle zoomLinks
    if (updateData.zoomLinks) {
      updateData.zoomLinks = Array.isArray(updateData.zoomLinks)
        ? updateData.zoomLinks
        : JSON.parse(updateData.zoomLinks);
    }

    // Handle youtubeLinks
    if (updateData.youtubeLinks) {
      updateData.youtubeLinks = Array.isArray(updateData.youtubeLinks)
        ? updateData.youtubeLinks
        : JSON.parse(updateData.youtubeLinks);
    }

    // Apply all update data to the course
    Object.assign(course, updateData);
    await course.save();

    res.json({ message: "Course updated successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};



export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    /*if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to update this course" });
      return;
    }*/

    // Convert and validate price if present
    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        res.status(400).json({
          message: "Invalid price format",
          error: "Price must be a valid number",
        });
        return;
      }
      updateData.price = price * 100;
    }

    // Parse and format sections if provided
    if (updateData.sections) {
      const sectionsData =
        typeof updateData.sections === "string"
          ? JSON.parse(updateData.sections)
          : updateData.sections;

      updateData.sections = sectionsData.map((section: any) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),

        // Handle section resources here
        resources: Array.isArray(section.resources)
          ? section.resources.map((res: any) => ({
              fileName: res.fileName,
              fileType: res.fileType,
              fileUrl: res.fileUrl,
              // Optionally add resourceId if your model uses it
              resourceId: res.resourceId || uuidv4(),
            }))
          : [],

        chapters: section.chapters.map((chapter: any) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
        })),
      }));
    }

    // Handle uploadedResources (course-wide resources)
    if (updateData.uploadedResources) {
      updateData.uploadedResources = Array.isArray(updateData.uploadedResources)
        ? updateData.uploadedResources
        : JSON.parse(updateData.uploadedResources);
    }

    // Handle zoomLinks
    if (updateData.zoomLinks) {
      updateData.zoomLinks = Array.isArray(updateData.zoomLinks)
        ? updateData.zoomLinks
        : JSON.parse(updateData.zoomLinks);
    }

    // Handle youtubeLinks
    if (updateData.youtubeLinks) {
      updateData.youtubeLinks = Array.isArray(updateData.youtubeLinks)
        ? updateData.youtubeLinks
        : JSON.parse(updateData.youtubeLinks);
    }

    // Apply all update data to the course
    Object.assign(course, updateData);
    await course.save();

    res.json({ message: "Course updated successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};



export const updateCourse1 = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

  console.log("Course resources:", updateData.resources);

  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    /*if (course.teacherId !== userId) {
      res
        .status(403)
        .json({ message: "Not authorized to update this course " });
      return;
    }*/

    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        res.status(400).json({
          message: "Invalid price format",
          error: "Price must be a valid number",
        });
        return;
      }
      updateData.price = price * 100;
    }

    if (updateData.sections) {
      const sectionsData =
        typeof updateData.sections === "string"
          ? JSON.parse(updateData.sections)
          : updateData.sections;

      updateData.sections = sectionsData.map((section: any) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        chapters: section.chapters.map((chapter: any) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
        })),
      }));
    }

    Object.assign(course, updateData);
    await course.save();

    res.json({ message: "Course updated successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const { userId } = getAuth(req);

  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    /*if (course.teacherId !== userId) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this course " });
      return;
    }*/

    await Course.delete(courseId);

    res.json({ message: "Course deleted successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

export const getUploadVideoUrl = async (
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
    const ext = path.extname(fileName);
    const s3Key = `videos/raw/${uniqueId}${ext}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 4800,
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);

    // The raw file is uploaded to videos/raw/{uniqueId}{ext}, but an
    // external pipeline transcodes it to HLS and writes the output to
    // videos/hls/{uniqueId}/{uniqueId}.m3u8 (master playlist), alongside
    // per-resolution variant playlists/segments. Since the id is shared,
    // we can point the chapter's videoUrl at the future HLS location.
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/hls/${uniqueId}/${uniqueId}.m3u8`;

    res.json({
      message: "Upload URL generated successfully",
      data: { uploadUrl, videoUrl },
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};


export const getUploadResourceUrl = async (
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
    const s3Key = `resources/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 4800, // in seconds (80 minutes)
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const resourceUrl = `${process.env.CLOUDFRONT_DOMAIN}/resources/${uniqueId}/${fileName}`;

    res.json({
      message: "Resource upload URL generated successfully",
      data: { uploadUrl, resourceUrl },
    });
  } catch (error) {
    console.error("Error generating resource upload URL:", error);
    res.status(500).json({ message: "Error generating resource upload URL", error });
  }
};


function extractS3KeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  const rawKey = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;
  return decodeURIComponent(rawKey); // 💥 decode %20 to space
}


export const deleteResourceFromS3 = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { resourceUrl } = req.body;

  if (!resourceUrl) {
    res.status(400).json({ message: "Missing key in request body" });
    return;
  }

  const key = extractS3KeyFromUrl(resourceUrl);

  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    };

    await s3.deleteObject(params).promise();

    res.json({ message: "Resource deleted successfully", key });
  } catch (error) {
    console.error("Error deleting resource from S3:", error);
    res.status(500).json({ message: "Error deleting resource from S3", error });
  }
};

