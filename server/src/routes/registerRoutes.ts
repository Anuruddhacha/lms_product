import express from "express";
import { getAllRegistrationCodes, updateRegistrationStatus, checkRegistrationCodeStatus, saveRegistrationCodeIfNew, acceptRegistrationCode, registerAnotherCodeForExistingUser, deleteRegistrationByEmail } from "../controllers/registerController";

const router = express.Router();

router.get("/getAllRegistrationCodes", getAllRegistrationCodes);
router.post("/updateRegistrationStatus", updateRegistrationStatus);
router.post("/checkRegistrationCodeStatus", checkRegistrationCodeStatus);
router.post("/saveRegistrationCodeIfNew", saveRegistrationCodeIfNew);
router.post("/acceptRegistrationCode", acceptRegistrationCode);
router.post("/registerAnotherCodeForExistingUser", registerAnotherCodeForExistingUser);
router.delete("/deleteRegistrationByEmail", deleteRegistrationByEmail);

export default router;
