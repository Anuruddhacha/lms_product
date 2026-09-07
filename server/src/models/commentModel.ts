import { Schema, model } from "dynamoose";

// Define the comment schema
const commentSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true, // Primary key
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: false,
    },
    chapterId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    saveUnknown: false, // Only allow defined fields
    timestamps: true,   // Adds createdAt and updatedAt
  }
);

// Create and export the comment model
const Comment = model("Comment", commentSchema);
export default Comment;
