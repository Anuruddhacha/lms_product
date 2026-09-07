import express from "express";
import {
  getUploadFeedbackVideoUrl,
  saveFeedback,
  getAllFeedback,
  deleteFeedback,
} from "../controllers/feedbackController";

const router = express.Router();

// Feedback Routes
router.post("/getUploadFeedbackVideoUrl", getUploadFeedbackVideoUrl);
router.post("/saveFeedback", saveFeedback);
router.get("/getAllFeedback", getAllFeedback);
router.delete("/deleteFeedback/:id", deleteFeedback);

export default router;
