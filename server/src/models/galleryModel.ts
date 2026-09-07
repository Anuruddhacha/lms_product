import { Schema, model } from "dynamoose";

// Define the banner schema
const gallerySchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    saveUnknown: false, // Only allow defined fields
    timestamps: true,   // Adds createdAt and updatedAt
  }
);

// Create and export the banner model
const GalleryImage = model("GalleryImage", gallerySchema);
export default GalleryImage;
