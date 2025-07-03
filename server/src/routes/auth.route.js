import express from "express";
import { loginUser, registerUser, resetPassword, sendForgotOTP, verifyOTP } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-forgot-otp", sendForgotOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;