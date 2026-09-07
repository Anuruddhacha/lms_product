import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Comment from "../models/commentModel";

// Add a new comment
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { comment, chapterId, userId } = req.body;

    if (!comment || !chapterId || !userId) {
      res.status(400).json({ message: "Comment is required" });
      return;
    }

    const newComment = new Comment({
      id: uuidv4(),
      comment,
      chapterId,
      userId,
      date: new Date(),
    });

    await newComment.save();

    res.status(200).json({
      message: "Comment added successfully",
      data: { success: true },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error adding comment", error });
  }
};

// Delete a comment by ID
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const comment = await Comment.get(id);

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    await Comment.delete(id);

    res.status(200).json({ message: "Comment deleted successfully", data: comment });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error deleting comment", error });
  }
};

// Get all comments for a specific chapterId
export const getAllCommentsForChapterId  = async (req: Request, res: Response): Promise<void> => {
  const { chapterId } = req.params;

  try {
    const comments = await Comment.scan("chapterId").eq(chapterId).exec();

    res.status(200).json({
      message: "Comments fetched successfully",
      data: { comments },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      message: "Server error fetching comments",
      data: { comments: [] },
      error,
    });
  }
};

// Update comment with reply (admin/teacher action)
export const updateComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply) {
    res.status(400).json({ message: "Reply is required" });
    return;
  }

  try {
    const comment = await Comment.get(id);

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    comment.reply = reply;
    await comment.save();

    res.status(200).json({
      message: "Comment replied successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ message: "Server error updating comment", error });
  }
};
