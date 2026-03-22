import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword, verifyEmail, resendVerifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendVerifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
