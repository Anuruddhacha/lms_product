import { Request, Response } from "express";
import DBUser from "../models/userModel";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { createClerkClient } from '@clerk/backend'
import CourseRequest from "../models/courseRequestModel";
import RegistrationCode from "../models/registrationCodeModel";
import Passcode from "../models/passcodeModel";

const s3 = new AWS.S3();

export const saveUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Save user request body:", req.body);

    const { id, name, email, phone, address, profileImage } = req.body;

    if (!id || !name || !email || !phone) {
      res.status(400).json({
        data: { success: false, message: "Missing required user fields" },
        message: "Missing required user fields",
      });
      return;
    }

    const newUser = new DBUser({
      id,
      name,
      email,
      phone,
      address,
      profileImage,
    });

    await newUser.save();

    res.status(200).json({
      data: { success: true, message: "User saved successfully" },
      message: "User saved successfully",
    });
  } catch (error) {
    console.error("User saving error:", error);
    res.status(500).json({
      data: { success: false, message: "Server error in saving user" },
      message: "Server error in saving user",
    });
  }
};


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Get all users request");

    const users = await DBUser.scan().exec();

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      message: "Error retrieving users",
      error,
    });
  }
};


export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    console.log("Get user by ID request:", userId);

    const user = await DBUser.get(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User retrieved successfully", data: user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Error retrieving user", error });
  }
};



export const getUploadProfileImageUrl = async (
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
    const s3Key = `profile-images/${uniqueId}/${fileName}`;

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 300, // 5 minutes
      ContentType: fileType,
    };

    const uploadUrl = s3.getSignedUrl("putObject", s3Params);
    const imageUrl = `${process.env.CLOUDFRONT_DOMAIN}/profile-images/${uniqueId}/${fileName}`;

    res.json({
      message: "Upload URL generated successfully",
      data: { uploadUrl, imageUrl },
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export const deleteUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({
        data: { success: false, message: "Invalid email" },
        message: "Invalid email",
      });
      return;
    }

    // Scan for user(s) with the given email
    const users = await DBUser.scan("email").eq(email).exec();

    if (!users || users.length === 0) {
      res.status(404).json({
        data: { success: false, message: "No user found with this email" },
        message: "No user found with this email",
      });
      return;
    }

    // Delete user(s) from Clerk and your DB
    await Promise.all(
      users.map(async (user: any) => {
        // Delete from Clerk by user.id (Clerk userId)
        try {
          const response = await clerkClient.users.deleteUser(user.id);
          console.log(`Deleted Clerk user ${user.id}`);
        } catch (clerkError) {
          console.error(`Failed to delete Clerk user ${user.id}:`, clerkError);
        }

        // Delete from your DB
        await DBUser.delete(user.id);
      })
    );

    res.status(200).json({
      data: { success: true, message: `${users.length} user(s) deleted successfully (including Clerk users)` },
      message: "User(s) deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user by email:", error);
    res.status(500).json({
      data: { success: false, message: "Server error deleting user" },
      message: "Server error deleting user",
    });
  }
};



export const deleteUserAndDataByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({
        data: { success: false, message: "Invalid email" },
        message: "Invalid email",
      });
      return;
    }

    // Step 1: Delete user from DB + Clerk
    const users = await DBUser.scan("email").eq(email).exec();
    if (!users || users.length === 0) {
      res.status(404).json({
        data: { success: false, message: "No user found with this email" },
        message: "No user found with this email",
      });
      return;
    }

    await Promise.all(
      users.map(async (user: any) => {
        try {
          await clerkClient.users.deleteUser(user.id);
          console.log(`Deleted Clerk user ${user.id}`);
        } catch (clerkError) {
          console.error(`Failed to delete Clerk user ${user.id}:`, clerkError);
        }
        await DBUser.delete(user.id);
      })
    );

    // Step 2: Delete all course requests
    const courseRequests = await CourseRequest.scan({ email }).exec();
    if (courseRequests && courseRequests.length > 0) {
      await Promise.all(courseRequests.map((cr: any) => CourseRequest.delete(cr.code)));
    }

    // Step 3: Delete all registration codes
    const codes = await RegistrationCode.scan("email").eq(email).exec();
    if (codes && codes.length > 0) {
      await Promise.all(codes.map((code: any) => RegistrationCode.delete(code.code)));
    }

    res.status(200).json({
      data: { success: true, message: `User and related data deleted successfully.` },
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUserAndDataByEmail:", error);
    res.status(500).json({
      data: { success: false, message: "Internal server error while deleting user and related data." },
      message: "Internal server error while deleting user and related data",
    });
  }
};





/**
 * POST /register-user
 * Body:
 * {
 *   userId: string,
 *   name: string,
 *   email: string,
 *   registrationEmail: string,
 *   phone: string,
 *   address: string,
 *   selectedCourseIds: string[],
 *   registerCode: string,
 *   profileImageUrl: string,
 *   passcode?: string
 * }
 */
export const registerUserAtomic = async (req: Request, res: Response): Promise<void> => {
  const {
    userId,
    name,
    email,
    registrationEmail,
    phone,
    address,
    selectedCourseIds,
    registerCode,
    profileImageUrl,
    passcode,
  } = req.body;

  // For rollback
  let createdCourseRequestId: string | null = null;
  let createdRegistrationCode: string | null = null;
  let updatedPasscodeId: string | null = null;
  let createdUserId: string | null = null;

  // ---- Validation ----
  if (
    !userId ||
    !name ||
    !email ||
    !registrationEmail ||
    !phone ||
    !address ||
    !registerCode ||
    !Array.isArray(selectedCourseIds) ||
    selectedCourseIds.length === 0
  ) {
    res.status(400).json({
      data: { success: false, message: "Missing or invalid fields" },
      message: "Missing or invalid fields",
    });
    return;
  }

  if (email !== registrationEmail) {
    res.status(400).json({
      data: { success: false, message: "Email mismatch" },
      message: "Email mismatch",
    });
    return;
  }

  try {
    // 1) Validate & Save Registration Code (atomic guard)
    const existingCode = await RegistrationCode.get(registerCode);
    if (existingCode) {
      res.status(200).json({
        data: {
          success: false,
          alreadyExists: true,
          message: "Registration number already exists",
        },
        message: "Registration number already exists",
      });
      return;
    }

    const existingEmail = await RegistrationCode.scan("email").eq(email).exec();
    if (existingEmail.length > 0) {
      res.status(200).json({
        data: {
          success: false,
          alreadyExists: true,
          message: "Email already used for a registration code",
        },
        message: "Email already used for a registration code",
      });
      return;
    }

    const newRegistration = new RegistrationCode({
      code: registerCode,
      email,
      isExpired: false,
      isRegistered: false,
      isPending: true,
      isAccepted: false,
      isHolted: false,
    });

    await newRegistration.save();
    createdRegistrationCode = registerCode;

    // 2) Save Course Request
    const newCourseRequest = new CourseRequest({
      code: registerCode,
      isAccepted: false,
      userId,
      email,
      userName: name,
      phone,
      selectedCourseIds,
      profileImageUrl,
    });

    await newCourseRequest.save();
    createdCourseRequestId = registerCode;

    // 3) Update passcode status (optional)
    if (passcode) {
      const existingPasscodes = await Passcode.scan("passcode").eq(passcode).exec();
      const passcodeDoc = existingPasscodes[0];

      if (!passcodeDoc) {
        throw new Error("Passcode not found");
      }
      if (passcodeDoc.isTaken) {
        throw new Error("Passcode already taken");
      }

      passcodeDoc.isTaken = true;
      await passcodeDoc.save();
      updatedPasscodeId = passcodeDoc.passcode;
    }

    // 4) Save User (if not already saved)
    const userAlreadyExists = await DBUser.get(userId).catch(() => undefined);

    if (!userAlreadyExists) {
      const newUser = new DBUser({
        id: userId,
        name,
        email,
        phone,
        address,
        profileImage: profileImageUrl,
      });

      await newUser.save();
      createdUserId = userId;
    }

    // All good
    res.status(200).json({
      data: { success: true, message: "Registration completed successfully" },
      message: "Registration completed successfully",
    });
  } catch (error: any) {
    console.error("Error in registerUserAtomic:", error?.message || error);

    // ---- ROLLBACK BEST-EFFORT ----
    try {
      if (createdCourseRequestId) {
        await CourseRequest.delete(createdCourseRequestId);
      }
    } catch (e) {
      console.error("Rollback failed: CourseRequest", e);
    }

    try {
      if (createdRegistrationCode) {
        await RegistrationCode.delete(createdRegistrationCode);
      }
    } catch (e) {
      console.error("Rollback failed: RegistrationCode", e);
    }

    try {
      if (updatedPasscodeId) {
        const existingPasscodes = await Passcode.scan("passcode").eq(updatedPasscodeId).exec();
        const passcodeDoc = existingPasscodes[0];
        if (passcodeDoc) {
          passcodeDoc.isTaken = false;
          await passcodeDoc.save();
        }
      }
    } catch (e) {
      console.error("Rollback failed: Passcode", e);
    }

    try {
      if (createdUserId) {
        await DBUser.delete(createdUserId);
      }
    } catch (e) {
      console.error("Rollback failed: User", e);
    }

    res.status(500).json({
      data: { success: false, message: "Internal server error while processing registration" },
      message: "Registration failed",
    });
  }
};



