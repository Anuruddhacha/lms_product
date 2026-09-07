import { Request, Response } from "express";
import RegistrationCode from "../models/registrationCodeModel";




export const validateRegistrationWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, email } = req.body;

    if (!code || typeof code !== "string" || !email || typeof email !== "string") {
      res.status(400).json({
        data: { valid: false,isRegistered : false, message: "Code or email is not valid" },
        message: "Code or email is not valid"
      });
      return;
    }

    // Fetch the registration code from DB
    const registrationCode = await RegistrationCode.get(code);

    // If no code found
    if (!registrationCode) {
      res.status(401).json({
        data: { valid: false,isRegistered : false, message: "Code is not valid" },
        message: "Code is not valid"
      });
      return;
    }

    // Check email match
    if (registrationCode.email !== email) {
      res.status(401).json({
        data: { valid: false,isRegistered : false, message: "Email does not match registration code" },
        message: "Email does not match registration code"
      });
      return;
    }

    // Check if the code is expired
    if (registrationCode.isExpired) {
      res.status(401).json({
        data: { valid: false,isRegistered : false, message: "Code has expired" },
        message: "Code has expired"
      });
      return;
    }

    // Check if code already used
    if (registrationCode.usedByUserId) {
      res.status(401).json({
        data: { valid: false,isRegistered : false, message: "Code has already been used" },
        message: "Code has already been used"
      });
      return;
    }

    // Check if expiration date has passed
    const expirationDate = registrationCode.expirationDate ? new Date(registrationCode.expirationDate) : null;
    const currentDate = new Date();

    if (expirationDate && expirationDate < currentDate) {
      await RegistrationCode.update({ code }, { isExpired: true });
      res.status(401).json({
        data: { valid: false,isRegistered : false, message: "Code has expired" },
        message: "Code has expired"
      });
      return;
    }

    // Valid code and email
    res.status(200).json({
      data: { valid: true, isRegistered : registrationCode.isRegistered, message: "Code validated successfully" },
      message: "Code validated successfully"
    });
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({
      data: { valid: false,isRegistered : false, message: "Server error validating code" },
      message: "Server error validating code"
    });
  }
};


export const checkRegistrationCodeStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, email } = req.body;

    if (!code || typeof code !== "string" || !email || typeof email !== "string") {
      res.status(400).json({
        data: {
          success: false,
          isFirstTime: false,
          isPending: false,
          isAccepted: false,
          isHolted: false,
          isRegistered: false,
          message: "Invalid code or email",
        },
        message: "Code or email is not valid",
      });
      return;
    }

    // Try to fetch existing registration code
    const registrationCode = await RegistrationCode.get(code);

    if (!registrationCode) {
      // Code not found — just return "not found" status
      res.status(200).json({
        data: {
          success: false,
          isFirstTime: true,
          isPending: false,
          isAccepted: false,
          isHolted: false,
          isRegistered: false,
          message: "Registration code not found",
        },
        message: "Code does not exist",
      });
      return;
    }


    if(registrationCode.email !== email) {
      // Email does not match
      res.status(401).json({
        data: {
          success: false,
          isFirstTime: false,
          isPending: false,
          isAccepted: false,
          isHolted: false,
          isRegistered: false,
          message: "Email does not match registration code",
        },
        message: "Email does not match registration code",
      });
      return;
    }

    // Code found — return its status
    const { isPending, isAccepted, isExpired, isRegistered, isHolted } = registrationCode;

    const statusMessage =
      isExpired || isHolted
        ? "This code is expired or blocked"
        : isAccepted
        ? "Code is accepted"
        : isPending
        ? "Code is pending approval"
        : "Code found";

    res.status(200).json({
      data: {
        success: true,
        isFirstTime: false,
        isPending,
        isAccepted,
        isHolted,
        isRegistered,
        message: statusMessage,
      },
      message: "Code status checked successfully",
    });
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({
      data: {
        success: false,
        isFirstTime: false,
        isPending: false,
        isAccepted: false,
        isHolted: false,
        isRegistered: false,
        message: "Server error validating code",
      },
      message: "Internal server error",
    });
  }
};


export const acceptRegistrationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.body;

    console.log("request accepting........");

    if (!code || typeof code !== "string") {
      res.status(400).json({
        data: { success: false, message: "Invalid registration code" },
        message: "Invalid registration code",
      });
      return;
    }

    // Fetch the existing code from DB
    const registrationCode = await RegistrationCode.get(code);

    if (!registrationCode) {
      res.status(404).json({
        data: { success: false, message: "Registration code not found" },
        message: "Registration code not found",
      });
      return;
    }

    // Update status fields
    registrationCode.isPending = false;
    registrationCode.isAccepted = true;
    registrationCode.isHolted = false;

    // Save updated code
    await registrationCode.save();

    res.status(200).json({
      data: { success: true, message: "Registration code status updated" },
      message: "Registration code status updated",
    });
  } catch (error) {
    console.error("Error updating registration code:", error);
    res.status(500).json({
      data: { success: false, message: "Server error updating code status" },
      message: "Internal server error",
    });
  }
};





export const saveRegistrationCodeIfNew = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, email, isSavingRequest } = req.body;

    // Validate input
    if (!code || typeof code !== "string" || !email || typeof email !== "string") {
      res.status(400).json({
        data: {
          success: false,
          alreadyExists: false,
          message: "Invalid code or email",
        },
        message: "Validation failed",
      });
      return;
    }

    // Check if code already exists
    const existingCode = await RegistrationCode.get(code);
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

    // Check if email is already used
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


    if(!isSavingRequest){
      // If not a saving request, just return success
      res.status(200).json({
        data: {
          success: true,
          alreadyExists: false,
          message: "Registration number is valid",
        },
        message: "Valid registration number",
      });
      return;
    }

    // Save new registration code
    const newCode = new RegistrationCode({
      code,
      email,
      isExpired: false,
      isRegistered: false,
      isPending: true,
      isAccepted: false,
      isHolted: false,
    });

    await newCode.save();

    res.status(200).json({
      data: {
        success: true,
        alreadyExists: false,
        message: "Registration number saved successfully",
      },
      message: "Saved",
    });
  } catch (error) {
    console.error("Error saving registration code:", error);
    res.status(500).json({
      data: {
        success: false,
        alreadyExists: false,
        message: "Server error saving code",
      },
      message: "Internal server error",
    });
  }
};


export const registerAnotherCodeForExistingUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, email } = req.body;

    // Basic validation
    if (!code || typeof code !== "string" || !email || typeof email !== "string") {
      res.status(400).json({
        data: {
          success: false,
          message: "Invalid code or email",
        },
        message: "Validation failed",
      });
      return;
    }

    // Only check if the code already exists (but NOT the email)
    const existingCode = await RegistrationCode.get(code);
    if (existingCode) {
      res.status(200).json({
        data: {
          success: false,
          message: "Registration code already used",
        },
        message: "Registration code already used.",
      });
      return;
    }

    // Create a new registration code entry with the same email
    const newCode = new RegistrationCode({
      code,
      email,
      isExpired: false,
      isRegistered: false,
      isPending: true,
      isAccepted: false,
      isHolted: false,
    });

    await newCode.save();

    res.status(200).json({
      data: {
        success: true,
        message: "New registration code saved successfully for existing user",
      },
      message: "Success",
    });
  } catch (error) {
    console.error("Error registering another code:", error);
    res.status(500).json({
      data: {
        success: false,
        message: "Server error saving registration code",
      },
      message: "Internal server error",
    });
  }
};





export const saveRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Registration code:", req.body);
    const { code, saveNewCode = true, expirationDate, email, isRegistered } = req.body;
    console.log("code:", saveNewCode, code, expirationDate, email, isRegistered);
    // Validate the input code
    if (!code || typeof code !== "string") {
        console.log("Invalid Registration code:", req.body);
      res.status(400).json({ data: { success: false, message: "Invalid registration code" }, message: "Invalid registration code" });
      return;
    }

  

    // If the code is valid and you want to save a new registration code
    if (saveNewCode) {
        console.log("Save 11:", req.body);
      const saveResponse = await saveRegistrationCodeWithEmail(code, expirationDate, email,isRegistered);
      if (!saveResponse.success) {
        res.status(500).json({ data: { success: false, message: saveResponse.message }, message: saveResponse.message });
        return;
      }
    }

    // Respond with success if the code is valid
    res.status(200).json({ data: { success: true, message: "Registration successfull" }, message: "Registration successfull" });
    return;
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({ data: { success: false, message: "Server error validating code" }, message: "Server error validating code" });
    return;
  }
};

export const saveRegistrationCodeWithEmail = async (
  code: string,
  expirationDate?: string,
  email?: string,
  isRegistered?: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Saving registration code:", code);
    console.log("registration status:", isRegistered);

    // Check if code already exists
    const existingCode = await RegistrationCode.get(code);
    if (existingCode) {
      return { success: false, message: "Code already exists" };
    }

    // Check if email is already used
    if (email) {
      const emailExists = await RegistrationCode.scan("email").eq(email).exec();
      if (emailExists.count > 0) {
        return { success: false, message: "Email has already been used with a code" };
      }
    }

    // Create a new registration code entry
    const newCode = new RegistrationCode({
      code,
      expirationDate,
      isExpired: false,
      email,
      isRegistered
    });

    await newCode.save();  

    return { success: true, message: "Registration code saved successfully" };
  } catch (error) {
    console.error("Error saving registration code:", error);
    return { success: false, message: "Error saving registration code" };
  }
};





// Function to save a registration code
export const saveRegistrationCode = async (
code: string, expirationDate?: string, email?: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(" SavingRegistration code:", code);
    // Check if code already exists
    const existingCode = await RegistrationCode.get(code);
    if (existingCode) {
      return { success: false, message: "Code already exists" };
    }

    // Create a new registration code document
    const newCode = new RegistrationCode({
      code,
      expirationDate, // Optional expiration date
      isExpired: false, // New code is not expired by default
      email: email, // Optional email field
    });

    // Save the new registration code
    await newCode.save();

    return { success: true, message: "Registration code saved successfully" };
  } catch (error) {
    console.error("Error saving registration code:", error);
    return { success: false, message: "Error saving registration code" };
  }
};


// Get all registration codes
export const getAllRegistrationCodes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all registration codes
    const codes = await RegistrationCode.scan().exec(); // or RegistrationCode.find() if using Mongoose

    res.status(200).json({
      data: {data: codes },
      message: "Registration codes fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching registration codes:", error);
    res.status(500).json({
      data: [],
      message: "Server error fetching registration codes",
    });
  }
};



export const updateRegistrationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, isRegistered = true } = req.body;

    if (!code || typeof code !== "string") {
      res.status(400).json({
        data: { success: false, message: "Invalid registration code" },
        message: "Invalid registration code",
      });
      return;
    }

    const existingCode = await RegistrationCode.get(code);

    if (!existingCode) {
      res.status(404).json({
        data: { success: false, message: "Registration code not found" },
        message: "Registration code not found",
      });
      return;
    }

    existingCode.isRegistered = isRegistered;
    await existingCode.save();

    res.status(200).json({
      data: { success: true, message: "Registration status updated" },
      message: "Registration status updated",
    });
  } catch (error) {
    console.error("Error updating registration status:", error);
    res.status(500).json({
      data: { success: false, message: "Server error updating registration status" },
      message: "Server error updating registration status",
    });
  }
};


export const deleteRegistrationByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({
        data: { success: false, message: "Invalid email" },
        message: "Invalid email",
      });
      return;
    }

    // Scan for all codes with the given email
    const codes = await RegistrationCode.scan("email").eq(email).exec();

    if (!codes || codes.length === 0) {
      res.status(404).json({
        data: { success: false, message: "No registration codes found for this email" },
        message: "No registration codes found for this email",
      });
      return;
    }

    // Delete each code found
    await Promise.all(
      codes.map((code: any) => RegistrationCode.delete(code.code))
    );

    res.status(200).json({
      data: { success: true, message: "All registration codes deleted for this email" },
      message: "All registration codes deleted for this email",
    });
  } catch (error) {
    console.error("Error deleting registration codes:", error);
    res.status(500).json({
      data: { success: false, message: "Server error deleting registration codes" },
      message: "Internal server error",
    });
  }
};

