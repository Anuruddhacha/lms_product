import express from "express";
import { deleteCourseRequestByEmail, getAllCourseRequests, getCourseRequest, saveCourseRequest } from "../controllers/courseRequestController";


const router = express.Router();

router.post("/saveCourseRequest", saveCourseRequest);
router.get("/getCourseRequest/:code", getCourseRequest);
router.get("/getAllCourseRequests", getAllCourseRequests);
router.delete("/deleteCourseRequestByEmail/:email", deleteCourseRequestByEmail);

export default router;
