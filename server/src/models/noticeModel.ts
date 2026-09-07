import { Schema, model } from "dynamoose";

// Define the notice schema
const noticeSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    notice: {
      type: String,
      required: true,
    },
  },
  {
    saveUnknown: false, // Only allow defined fields
    timestamps: true,   // Adds createdAt and updatedAt
  }
);

// Create and export the notice model
const Notice = model("Notice", noticeSchema);

export default Notice;
