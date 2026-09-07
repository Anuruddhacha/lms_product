import CourseRequest from "../models/courseRequestModel";
import RegistrationCode from "../models/registrationCodeModel";
import { Request, Response } from "express";

export const saveCourseRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("save request body:", req.body);
    const { code, isAccepted,userId, email, userName, phone, selectedCourseIds, profileImageUrl} = req.body;
    console.log("request data:", code, isAccepted,userId, email, userName, phone, selectedCourseIds, profileImageUrl);

    // Create a new registration code entry
    const newCourse = new CourseRequest({
       code,
       isAccepted,
       userId,
       email,
       userName,
       phone,
       selectedCourseIds,
       profileImageUrl,
    });

    await newCourse.save(); 
  
   // If code is valid and not expired
    res.status(200).json({ data: { success: true, message: "Request saved successfully" }, message: "Request saved successfully" });
    return;
  } catch (error) {
    console.error("Request saving error:", error);
    res.status(500).json({ data: { success: false, message: "Server error in request saving" }, message: "Server error in request saving" });
    return;
  }
};

export const getCourseRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;
    console.log("get request code:", code);

    // Fetch the course request by code
    const courseRequest = await CourseRequest.get(code);

    if (!courseRequest) {
      res.status(404).json({ data: { success: false, message: "Course request not found" }, message: "Course request not found" });
      return;
    }

    res.status(200).json({ data: { success: true, courseRequest }, message: "Course request retrieved successfully" });
  } catch (error) {
    console.error("Error retrieving course request:", error);
    res.status(500).json({ data: { success: false, message: "Server error in retrieving course request" }, message: "Server error in retrieving course request" });
  }
};

// Get all course requests
export const getAllCourseRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all course requests
    const courseRequests = await CourseRequest.scan().exec();

    
    res.status(200).json({
      data: { data: courseRequests },
      message: "Course requests fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching course requests:", error);
    res.status(500).json({
      data: [],
      message: "Server error fetching course requests",
    });
  }
};

export const updateCourseRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;
    const { isAccepted, userId } = req.body;

    // Fetch the course request by code
    const courseRequest = await CourseRequest.get(code);

    if (!courseRequest) {
      res.status(404).json({ data: { success: false, message: "Course request not found" }, message: "Course request not found" });
      return;
    }

    // Update the course request
    courseRequest.isAccepted = isAccepted;
    courseRequest.userId = userId;

    await courseRequest.save();

    res.status(200).json({ data: { success: true, message: "Course request updated successfully" }, message: "Course request updated successfully" });
  } catch (error) {
    console.error("Error updating course request:", error);
    res.status(500).json({ data: { success: false, message: "Server error in updating course request" }, message: "Server error in updating course request" });
  }
};


export const deleteCourseRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;

    // Fetch the course request by code
    const courseRequest = await CourseRequest.get(code);

    if (!courseRequest) {
      res.status(404).json({ data: { success: false, message: "Course request not found" }, message: "Course request not found" });
      return;
    }

    // Delete the course request
    await CourseRequest.delete(code);

    res.status(200).json({ data: { success: true, message: "Course request deleted successfully" }, message: "Course request deleted successfully" });
  } catch (error) {
    console.error("Error deleting course request:", error);
    res.status(500).json({ data: { success: false, message: "Server error in deleting course request" }, message: "Server error in deleting course request" });
  }
};


export const deleteAllCourseRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all course requests
    const courseRequests = await CourseRequest.scan().exec();

    // Delete all course requests
    for (const courseRequest of courseRequests) {
      await CourseRequest.delete(courseRequest.code);
    }

    res.status(200).json({ data: { success: true, message: "All course requests deleted successfully" }, message: "All course requests deleted successfully" });
  } catch (error) {
    console.error("Error deleting all course requests:", error);
    res.status(500).json({ data: { success: false, message: "Server error in deleting all course requests" }, message: "Server error in deleting all course requests" });
  }
};


export const getCourseRequestByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    // Fetch the course request by userId
    const courseRequest = await CourseRequest.scan({ userId }).exec();

    if (!courseRequest) {
      res.status(404).json({ data: { success: false, message: "Course request not found" }, message: "Course request not found" });
      return;
    }

    res.status(200).json({ data: { success: true, courseRequest }, message: "Course request retrieved successfully" });
  } catch (error) {
    console.error("Error retrieving course request:", error);
    res.status(500).json({ data: { success: false, message: "Server error in retrieving course request" }, message: "Server error in retrieving course request" });
  }
};



export const getCourseRequestByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params;

    // Fetch the course request by email
    const courseRequest = await CourseRequest.scan({ email }).exec();

    if (!courseRequest) {
      res.status(404).json({ data: { success: false, message: "Course request not found" }, message: "Course request not found" });
      return;
    }

    res.status(200).json({ data: { success: true, courseRequest }, message: "Course request retrieved successfully" });
  } catch (error) {
    console.error("Error retrieving course request:", error);
    res.status(500).json({ data: { success: false, message: "Server error in retrieving course request" }, message: "Server error in retrieving course request" });
  }
};


export const deleteCourseRequestByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params;

    // Find course requests with the given email
    const courseRequests = await CourseRequest.scan({ email }).exec();

    if (!courseRequests || courseRequests.length === 0) {
      res.status(404).json({
        data: { success: false, message: "No course requests found with the given email" },
        message: "No course requests found with the given email",
      });
      return;
    }

    // Delete all course requests matching this email
    for (const courseRequest of courseRequests) {
      await CourseRequest.delete(courseRequest.code);
    }

    res.status(200).json({
      data: { success: true, message: "Course requests deleted successfully" },
      message: "Course requests deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course request by email:", error);
    res.status(500).json({
      data: { success: false, message: "Server error in deleting course request by email" },
      message: "Server error in deleting course request by email",
    });
  }
};



