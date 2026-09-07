import express from "express";
import { allUsers, updateUser } from "../controllers/userClerkController";

const router = express.Router();

router.put("/:userId", updateUser);
router.get("/allusers", allUsers)

export default router;
