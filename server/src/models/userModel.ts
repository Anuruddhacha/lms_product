import { Schema, model } from "dynamoose";

// Define the user schema
const userSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key for the user
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: {
        name: "emailIndex",
      },
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String, // URL to the profile image
      required: false,
    },
  },
  {
    saveUnknown: true, // Allow saving extra fields if needed
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create and export the user model
const DBUser = model("DBUser", userSchema);
export default DBUser;
