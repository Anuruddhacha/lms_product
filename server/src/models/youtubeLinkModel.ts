import { Schema, model } from "dynamoose";

// Define the YouTube link schema
const youtubeLinkSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    youtubeUrl: {
      type: String,
      required: true,
    },
  },
  {
    saveUnknown: false, // Only allow defined fields
    timestamps: true,   // Adds createdAt and updatedAt
  }
);

// Create and export the YouTubeLink model
const YouTubeLink = model("YouTubeLink", youtubeLinkSchema);
export default YouTubeLink;
