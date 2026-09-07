import { Schema, model } from "dynamoose";

// Define the event schema
const eventSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    subImages: {
      type: Array,
      schema: [String], // Array of string URLs
      required: false,  // Optional field
    },
  },
  {
    saveUnknown: false,
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create and export the event model
const Event = model("Event", eventSchema);
export default Event;
