import express from "express";
import { addComment, deleteComment, getAllCommentsForChapterId , updateComment } from "../controllers/commentsController";

const router = express.Router();


router.post("/comments/addComment", addComment);
router.delete("/comments/:id", deleteComment);
router.get("/comments/chapter/:chapterId", getAllCommentsForChapterId );
router.put("/comments/:id/reply", updateComment);


export default router;
