import express from "express";
import {
  enrollUserInCourse,
  getUserCourseProgress,
  getUserEnrolledCourses,
  updateUserCourseProgress,
  unenrollUserFromCourse,
} from "../controllers/userCourseProgressController";

const router = express.Router();

router.get("/:userId/enrolled-courses", getUserEnrolledCourses);
router.get("/:userId/courses/:courseId", getUserCourseProgress);
router.put("/:userId/courses/:courseId", updateUserCourseProgress);
router.post("/enrollUserInCourse", enrollUserInCourse);
router.post("/unenrollUserFromCourse", unenrollUserFromCourse);

export default router;
