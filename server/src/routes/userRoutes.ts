import express from "express";
import { deleteUserAndDataByEmail, deleteUserByEmail, getAllUsers, getUploadProfileImageUrl, getUserById, registerUserAtomic, saveUser } from "../controllers/userController";

const router = express.Router();

router.post("/saveUser", saveUser); 
router.post("/getUploadProfileImageUrl", getUploadProfileImageUrl);
router.get("/getUserById/:userId", getUserById);
router.get("/getAllusers",getAllUsers);
router.delete("/deleteUserByEmail", deleteUserByEmail);
router.delete("/delete-user-and-data", deleteUserAndDataByEmail);
router.post("/register-user", registerUserAtomic);

export default router;
