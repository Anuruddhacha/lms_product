import express from "express";
import { createPaymentSession, verifyPayment } from "../controllers/paymentsController";

const router = express.Router();

// Route to create a payment session
router.post("/create-session", createPaymentSession);
router.get("/verify", verifyPayment);

export default router;
