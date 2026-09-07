import { Schema, model } from "dynamoose";

// Define the review schema
const reviewSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false, // optional role
    },
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      validate: (value) => typeof value === "number" && value >= 1 && value <= 5, // rating must be 1 to 5
    },
  },
  {
    saveUnknown: false, // Only allow defined fields
    timestamps: true,   // Adds createdAt and updatedAt
  }
);

// Create and export the review model
const Review = model("Review", reviewSchema);
export default Review;
