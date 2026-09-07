import express from "express";
import {
  saveReview,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController";

const router = express.Router();

// Review Routes
router.post("/saveReview", saveReview);
router.get("/getAllReviews", getAllReviews);
router.delete("/deleteReview/:id", deleteReview);

export default router;
