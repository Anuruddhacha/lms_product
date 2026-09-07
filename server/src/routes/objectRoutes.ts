import express from "express";
import { deleteS3ObjectByUrl, deleteVideoAssets } from "../controllers/objectController";

const router = express.Router();

router.post("/delete-object", deleteS3ObjectByUrl);
router.post("/delete-video-assets", deleteVideoAssets);

export default router;
