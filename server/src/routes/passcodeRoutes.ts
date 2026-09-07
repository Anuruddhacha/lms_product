import express from "express";
import {
  getAllPasscodes,
  updatePasscodeStatus,
  savePasscodeIfNotTaken,
  deletePasscodeByCode,
  isPasscodeTaken,
} from "../controllers/passcodeController";

const router = express.Router();

router.get("/getAllPasscodes", getAllPasscodes);
router.post("/updatePasscodeStatus", updatePasscodeStatus);
router.post("/savePasscodeIfNotTaken", savePasscodeIfNotTaken);
router.delete("/deletePasscode/:passcode", deletePasscodeByCode);
router.get("/is-taken/:passcode", isPasscodeTaken);

export default router;
