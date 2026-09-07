import { Schema, model } from "dynamoose";

// Define the feedback schema
const feedbackSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    feedbackVideoUrl: {
      type: String,
      required: false, // Make optional if some feedbacks may not have video
    },
  },
  {
    saveUnknown: false, // Only allow defined fields
    timestamps: true,   // Adds createdAt and updatedAt
  }
);

// Create and export the feedback model
const Feedback = model("Feedback", feedbackSchema);
export default Feedback;
