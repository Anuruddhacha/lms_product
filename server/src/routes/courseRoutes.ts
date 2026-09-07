import express from "express";
import multer from "multer";
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  getAllCourses,
  updateCourse,
  getUploadVideoUrl,
  getCoursesByIds,
  getUploadResourceUrl,
  deleteResourceFromS3,
} from "../controllers/courseController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", listCourses);
router.get("/all", getAllCourses);
router.get("/getCoursesByIds", getCoursesByIds);
router.post("/", createCourse);
router.post("/deleteResourceFromS3", deleteResourceFromS3);

router.get("/:courseId", getCourse);
router.put("/:courseId", upload.single("image"), updateCourse);
router.delete("/:courseId", deleteCourse);

router.post(
  "/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url",
  getUploadVideoUrl
);

router.post(
  "/getUploadResourceUrl/:courseId",
  getUploadResourceUrl
);

export default router;
