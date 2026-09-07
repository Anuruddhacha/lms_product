import express from "express";
import {
  saveYouTubeLink,
  getAllYouTubeLinks,
  deleteYouTubeLink,
} from "../controllers/youtubelinkController"; // Adjust path as needed

const router = express.Router();

router.post("/saveYouTubeLink", saveYouTubeLink);
router.get("/getAllYouTubeLinks", getAllYouTubeLinks);
router.delete("/deleteYouTubeLink/:id", deleteYouTubeLink);

export default router;
