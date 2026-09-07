import { Schema, model } from "dynamoose";

// Define the passcode schema
const passcodeSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    passcode: {
      type: String,
      required: true,
    },
    isTaken: {
      type: Boolean,
      default: false, // Indicates whether the passcode has been used
    },
  },
  {
    saveUnknown: true, // Allow unknown fields (optional)
    timestamps: true,  // Automatically adds createdAt and updatedAt
  }
);

// Create the model using the schema
const Passcode = model("Passcode", passcodeSchema);

// Export the model
export default Passcode;
