import express from "express";
import {
  enrollUserInCourse,
  getUserCourseProgress,
  getUserEnrolledCourses,
  updateUserCourseProgress,
  unenrollUserFromCourse,
  enrollUserInAllSpecialCategoryCourses
} from "../controllers/userCourseProgressController";

const router = express.Router();

router.get("/:userId/enrolled-courses", getUserEnrolledCourses);
router.get("/:userId/courses/:courseId", getUserCourseProgress);
router.put("/:userId/courses/:courseId", updateUserCourseProgress);
router.post("/enrollUserInCourse", enrollUserInCourse);
router.post("/unenrollUserFromCourse", unenrollUserFromCourse);
router.post("/enrollUserInAllSpecialCategoryCourses", enrollUserInAllSpecialCategoryCourses);

export default router;
