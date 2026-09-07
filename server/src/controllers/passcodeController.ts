import { Request, Response } from "express";
import Passcode from "../models/passcodeModel";
import { v4 as uuidv4 } from "uuid";

// Save a passcode only if it doesn't exist yet
// Save a passcode only if it doesn't exist yet
export const savePasscodeIfNotTaken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, passcode } = req.body;

    if (!passcode || typeof passcode !== "string") {
      res.status(400).json({
        data: { success: false, message: "Invalid passcode" },
        message: "Invalid passcode",
      });
      return;
    }

    // Check if passcode already exists in DB
    const existingPasscodes = await Passcode.scan("passcode").eq(passcode).exec();
    if (existingPasscodes.length > 0) {
      res.status(200).json({
        data: { success: false, message: "Passcode already exists", isTaken: existingPasscodes[0].isTaken },
        message: "Passcode already exists",
      });
      return;
    }

    const newPasscode = new Passcode({
      id: uuidv4(),
      email: email || "",
      phone: phone || "",
      passcode,
      isTaken: false,
    });

    await newPasscode.save();

    res.status(201).json({
      data: { success: true, message: "Passcode saved successfully", isTaken: false },
      message: "Passcode saved",
    });
  } catch (error) {
    console.error("Error saving passcode:", error);
    res.status(500).json({
      data: { success: false, message: "Server error saving passcode" },
      message: "Internal server error",
    });
  }
};

// Get all passcodes
export const getAllPasscodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const passcodes = await Passcode.scan().exec();

    res.status(200).json({
      data: passcodes,
      message: "Passcodes fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching passcodes:", error);
    res.status(500).json({
      data: [],
      message: "Server error fetching passcodes",
    });
  }
};

// Update passcode status to isTaken = true
export const updatePasscodeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passcode } = req.body;

    const code = passcode;

    console.log("===============Received passcode=====================:", code);
    console.log("===============Received passcode type=====================:", typeof code);

    if (!code || typeof code !== "string") {
      res.status(400).json({
        data: { success: false, message: "Invalid passcode code" },
        message: "Invalid passcode code",
      });
      return;
    }

   // const existing = await Passcode.get(code);
   const existingPasscodes = await Passcode.scan("passcode").eq(passcode).exec();
   const existing = existingPasscodes[0]

    if (!existing) {
      res.status(404).json({
        data: { success: false, message: "Passcode not found" },
        message: "Passcode not found",
      });
      return;
    }

    if (existing.isTaken) {
      res.status(400).json({
        data: { success: false, message: "Passcode already marked as taken" },
        message: "Passcode already taken",
      });
      return;
    }

    existing.isTaken = true;
    await existing.save();

    res.status(200).json({
      data: { success: true, message: "Passcode status updated to taken" },
      message: "Passcode updated",
    });
  } catch (error) {
    console.error("Error updating passcode status:", error);
    res.status(500).json({
      data: { success: false, message: "Server error updating passcode" },
      message: "Internal server error",
    });
  }
};


// Delete a passcode by passcode value
export const deletePasscodeByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passcode } = req.params;

    if (!passcode || typeof passcode !== "string") {
      res.status(400).json({
        data: { success: false, message: "Invalid passcode" },
        message: "Invalid passcode",
      });
      return;
    }

    // Find by passcode (assuming passcode is not the primary key)
    const results = await Passcode.scan("passcode").eq(passcode).exec();

    if (results.length === 0) {
      res.status(404).json({
        data: { success: false, message: "Passcode not found" },
        message: "Passcode not found",
      });
      return;
    }

    // Delete the first matching item (passcode should be unique)
    await results[0].delete();

    res.status(200).json({
      data: { success: true, message: "Passcode deleted successfully" },
      message: "Passcode deleted",
    });
  } catch (error) {
    console.error("Error deleting passcode:", error);
    res.status(500).json({
      data: { success: false, message: "Server error deleting passcode" },
      message: "Internal server error",
    });
  }
};


export const isPasscodeTaken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passcode } = req.params;

    if (!passcode || typeof passcode !== "string") {
       res.status(400).json({ message: "Invalid passcode" });
       return;
    }

    const results = await Passcode.scan("passcode").eq(passcode).exec();

    if (results.length === 0) {
       res.status(404).json({ message: "Passcode not found. Enter a valid one"});
       return;
    }

    const isTaken = results[0]?.isTaken === true;

     res.status(200).json({
     data: { success: true,isTaken:isTaken, message: "Passcode status retrived successfully" },
      message: "Passcode status retrived successfully",
    });
  } catch (error) {
    console.error("Error checking passcode status:", error);
     res.status(500).json({ message: "Internal server error" });
  }
};



